<template>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition" :overlay="false" :content-class="fullscreen?'server-chat fullscreen':'server-chat windowed'">
    <v-toolbar dark color="indigo darken-1" height="48px" id="chat-box-toolbar">
      <v-toolbar-title>Server Chat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="fullscreen = !fullscreen">
        <v-icon v-show="!fullscreen">check_box_outline_blank</v-icon>
        <v-icon v-show="fullscreen">filter_none</v-icon>
      </v-btn>
      <v-btn icon dark @click="dialog = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout row id="chat-box">
      <v-flex xs12 sm9 md10>
        <v-card flat id="message-box">
          <v-tabs
            v-model="currentChannel"
            color="primary"
            dark
            slider-color="yellow"
          >
            <v-tab
              v-for="channel in channels"
              :key="channel.id"
              :href="`#${channel.id}`"
              ripple
            >
              {{ channel.name }}
            </v-tab>
            <v-tab-item
              v-for="channel in channels"
              :key="channel.id"
              :id="`${channel.id}`"
            >
              <div class="messages-list" :ref="'chat_'+channel.id">
                <transition-group tag="ul" name="message-appear">
                  <!-- TODO: 여기서 시작 -->
                  <li v-for="(message, index) in messages[channel.id]" v-bind:key="`message_${index}`">
                    <div class="message-metadata">
                      <span class="received-at">{{message.received_at}}</span>
                      <img v-if="message.steamid" :src="webUsers[message.steamid].avatar" class="avatar">
                      <span class="username">{{message.username}}</span>
                    </div>
                    <span v-text="message.body" class="message-body"></span>
                  </li>
                </transition-group>
              </div>
            </v-tab-item>
          </v-tabs>
        </v-card>
        <div id="your-message">
          <v-text-field
            label="What do you want to say?"
            v-model="inputMessage" @keyup.native.13="sendMessage"
            single-line
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex hidden-xs-only sm3 md2>
        <v-card flat id="user-list-box">
          <transition-group tag="ul" name="message-appear" id="user-list">
            <li v-ripple v-for="(user, steamid) in webUsers" v-bind:key="`chatuser_${steamid}`">
              <img :src="user.avatar" class="avatar">
              <span v-text="user.displayName" class="username"></span>
            </li>
          </transition-group>
        </v-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>


<script>
import io from 'socket.io-client';
var socket = null;

export default {
  name: 'server-chat',
  data () {
    return {
      dialog: false,
      fullscreen: false,
      inputMessage: '',
      currentChannel: 'common',
      webUsers: {},
      channels: [],
      messages: {}
    }
  },
  methods: {
    sendMessage: function(data) {
      if(socket) {
        if(this.inputMessage !== '' && this.currentChannel) {
          socket.emit('sendchat', this.currentChannel, this.inputMessage);
          this.inputMessage = ''
        }
      }
    },
    connectSocket: function() {
      if(!socket) {
        console.log(this.$store.getters['auth/authenticated']);
        socket = io('http://127.0.0.1:3000'/*location.origin*/, {query:{token:this.$store.getters['auth/token']}})

        var Vue = this;
        socket.on('connect', function() {
          console.log('connected to socket server.');
          socket.emit('adduser');
        });

        socket.on('notifychannels', function(channels) {
          Vue.channels = channels;
          channels.forEach(element => {
            // 아래 코드는 this.messages[element.id] = [] 와 같으나,
            // data 부분에서 미리 정의하지 않은 nested object는 reactive(자동 변경 탐지)가 지원되지 않는다.
            // 아래 코드를 통해 수동으로 reactive에 등록하면서 정의한다.
            Vue.$set(Vue.messages, element.id, [])
          });
        });

        socket.on('updateusers', function(userList){
          userList.forEach(function(e){
            Vue.webUsers[e.id] = e;
          });
        });

        socket.on('updatechat', function (channel, userData, data) {
          if(channel && Vue.messages[channel]) {
            Vue.messages[channel].push({steamid:userData.id, username:userData.displayName, body:data});

            Vue.$nextTick(function() {
              let messageList = Vue.$refs['chat_'+channel][0];
              // 스크롤을 아래로 내려놓고 있을 때만 강제로 스크롤한다.
              if(messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight < 90) {
                messageList.scrollTop = messageList.scrollHeight - 52;
              } else { // 대신 올려놓고 있을 때에는 최신 글이 있음을 표시한다.

              }
            })
          }
        });
      }
    },
    closeSocketConnection: function() {
      socket.close()
      this.dialog = false,
      this.fullscreen = false,
      this.inputMessage = '',
      this.currentChannel = 'common',
      this.webUsers = {},
      this.channels = [],
      this.messages = {}
      socket = null;
    }
  },
  mounted: function(){
    if(this.$store.getters['auth/authenticated']) {
      this.connectSocket();
    } else {
      this.$store.watch(
        (state, getters) => getters['auth/authenticated']
        , authenticated => {
          if (authenticated === true) {
            this.connectSocket();
            return
          } else {
            this.closeSocketConnection();
            return
          }
        }
      )
    }
  },
  watch: {
    fullscreen: function(newVal, oldVal){
      let messageList = this.$refs['chat_'+this.currentChannel][0];
      // 스크롤을 아래로 내려놓고 있을 때만 강제로 스크롤한다.
      if(messageList) {

        if(newVal === false && messageList.scrollTop === 0)
          this.$nextTick(()=>{
            setTimeout(()=>{
              messageList.scrollTop = messageList.scrollHeight;
            }, 300); // transition 시간 0.3s
          });
        else if(newVal === true && messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight < 90)
           messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .dialog--fullscreen.dialog.server-chat {
    overflow-y: hidden;
    border-radius: 0px;
  }
  .dialog--fullscreen.dialog.server-chat.windowed {
    margin: 0;
    height: 50% !important;
    position: fixed;
    top: 50% !important;
    left: 0;
  }

  .server-chat #chat-box {
    height: 100%;
  }

  .server-chat #chat-box-toolbar {
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
    z-index: 3;
  }

  .server-chat #chat-box #message-box {
    height: 100% !important;
  }

  .server-chat #chat-box #message-box .tabs,
  .server-chat #chat-box #message-box .tabs > .tabs__items,
  .server-chat #chat-box #message-box .tabs > .tabs__items > .tabs__content {
    height: 100%;
  }

  .server-chat #chat-box #message-box .messages-list {
    height: calc(100% - 48px - 127px); /* 탭 크기 - 채팅입력칸 크기*/
    padding-top: 20px;
    padding-left: 20px;
    overflow-y: auto;
    flex: 1;
  }
  .server-chat #chat-box #message-box .messages-list ul {
    list-style: none;
    padding: 0;
  }
  .server-chat #chat-box #message-box .messages-list ul li {
    padding: 5px 0;
    text-align: left;
  }
  .server-chat #chat-box #message-box .messages-list ul li.message-appear-enter-active,
  .server-chat #chat-box #message-box .messages-list ul li.message-appear-leave-active {
    transition: all 0.2s;
  }
  .server-chat #chat-box #message-box .messages-list ul li.message-appear-enter,
  .server-chat #chat-box #message-box .messages-list ul li.message-appear-leave-active {
    opacity: 0;
    transform: translateY(20px);
  }
  .server-chat #chat-box #message-box .messages-list ul li .message-metadata {
    display: inline-block;
  }
  .server-chat #chat-box #message-box .messages-list ul li .message-metadata .username {
    font-weight: bold;
  }
  .server-chat #chat-box #message-box .messages-list ul li .message-metadata .received-at {
    color: rgba(0, 0, 0, 0.4);
    margin-left: 5px;
    font-size: 0.9em;
  }
  .server-chat #chat-box #message-box .messages-list ul li .message-body {
    margin-left: 5px;
  }

  .server-chat #chat-box #your-message {
    position: fixed;
    bottom: 0;
    left: 0;
    width:100%;
    max-width: inherit;
    border-top:1px solid #ddd;
    background: rgba(255, 255, 255, 0.75);
    padding: 15px;
    -webkit-box-shadow: 0 -3px 5px -1px rgba(0,0,0,.2);
    box-shadow: 0px -3px 5px 0px rgba(0,0,0,.2);
  }
  .server-chat #chat-box #your-message .input-group {
    height: 30px;
    padding-top: 0px;
  }
  .server-chat #chat-box #your-message .input-group > label {
    top: 0px;
  }

  .server-chat #chat-box #user-list-box {
    height: calc(100% - 48px) !important;
    border-radius:0px;
    overflow-y: auto;
    background-color: #F0F0F0;
  }

  .server-chat #chat-box #user-list-box #user-list {
    text-align:left;
    padding-top:8px;
    list-style: none;
    width:100%;
  }

  .server-chat #chat-box #user-list-box #user-list li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left:10px;
    width:100%;
  }

  .server-chat #chat-box #user-list-box #user-list li .username {
    margin-left:5px;
  }

</style>
