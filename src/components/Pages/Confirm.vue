<template>
  <v-card class="confirm-box-container" v-if="target">
    <v-card-text class="confirm-text-container">
      <template v-if="type==='admin'">
        <span class="confirm-text confirm-question-text">web.administrator.confirm_delete_text</span>
        <span class="confirm-text confirm-question-text target"><img :src="target.avatar"/><span class="target-name" v-text="target.personaname"></span><span class="target-name-alias" v-if="target.admindata.alias" v-text="'('+target.admindata.alias+')'"></span></span>
      </template>
      <template v-else-if="type==='server'">
        <span class="confirm-text confirm-question-text">web.server.confirm_delete_text</span>
        <span class="confirm-text confirm-question-text target">
          <!-- TODO: 주소 바꾸기 -->
          <img v-if="target.icon.icon_type == 'image'" :src="'/api/images/servers/icons/'+target.icon.icon_content"/>
          <v-icon v-if="target.icon.icon_type == 'font'" v-text="props.item.icon.icon_content"></v-icon>
          <span v-text="target.displayname" class="target-name"></span>
          <span v-if="target.alias" class="target-name-alias" v-text="'('+target.alias+')'"></span>
        </span>
      </template>
    </v-card-text>
    <v-card-actions class="confirm-button-container">
      <v-layout row wrap class="confirm-button-container-row">
        <v-flex xs12 md6>
          <v-btn class="md-close confirm-button-no" @click.native="closeDialog"><span class="confirm-text confirm-no-text">web.administrator.confirm_delete_cancel</span></v-btn>
        </v-flex>
        <v-flex xs12 md6>
          <v-btn class="confirm-button-yes" color="error" :disabled="activeCountdown>0" @click.native="applyDelete"><span class="confirm-text confirm-yes-text" v-text="activeCountdown>0?activeCountdown:type==='admin'?'web.administrator.confirm_delete':type==='server'?'web.server.confirm_delete':''"></span></v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'confirm-box',
  props: ['type'],
  data () {
    return {
      target: null,
      activeCountdown: 0,
      timeoutHandler: null
    }
  },
  methods: {
    countdown: function(count) {
      let that = this
      return function() {
        that.activeCountdown = count;
        if(count > 0) {
          that.timeoutHandler = setTimeout(that.countdown(that.activeCountdown-1), 1000);
        }
      }
    },
    applyDelete:function(){
      let uri;
      if(this.type === 'admin') {
        uri = '/api/admin/user/delete/'+this.target.steamid;
      } else if(this.type === 'server') {
        uri = '/api/server/delete/'+this.target.id;
      }

      this.$http.post(uri, {})
      .then( response => {
        this.$emit('action-finish', response.data.message, response.data.error?'error':'success')
        this.$emit('close-dialog')
      })
      .catch( response => { console.log(response) } );
    },
    closeDialog: function(){
      if(this.timeoutHandler) clearTimeout(this.timeoutHandler)
      this.$emit('close-dialog')
    },
  }
}
</script>

<style scoped>
  button:focus{outline:0 !important;}

  .confirm-box-container {
      background-color: #fff;
  }

  .confirm-text {
      width:100%;
      text-align: center;
  }

  .confirm-text-container {
      text-align: center;
      padding-top: 6.25%;
  }

  .confirm-question-text {
      font-size:1.785rem;
  }

  .confirm-question-text.target {
      position: relative;
      display: inline-block;
      margin-top: 2.5rem;
  }

  .confirm-question-text.target img{
      margin-right: 5px;
      height:32px;
  }

  .confirm-button-container {
    padding:0px;
  }

  .confirm-button-container-row {
    margin:0px;
  }

  .confirm-button-container .btn {
      width:100%;
      height:100%;
      border-radius: 0px;
      margin:0px;
      height:4rem;
  }

  .confirm-button-yes {
      background-color: #ea6c65;
      text-align: center;
      text-transform: uppercase;
      transition: none;
      overflow: hidden;
  }

  .confirm-button-yes:hover:not(:disabled) {
      background-color: #fb5c53;
      font-weight: bold;
  }

  .confirm-button-yes:disabled {
      background-color:#ffbab6;
      color:#555;
      font-weight: bold;
      font-size:2rem;
  }

  .confirm-button-no {
      color:#333;
      background-color:buttonface;
      display: flex;
      text-align: center;
      text-transform: none;
  }

  .confirm-button-no:hover {
      background-color:#b6bece;
  }

  .target-name {
    vertical-align: super;
    font-size: 0.8em;
  }

  .target-name-alias {
    vertical-align: super;
    font-size: 0.5em;
    color:#888;
  }
</style>
