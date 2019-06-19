<template>
  <div class="server-register-form">
    <v-card>
      <v-card-title>
        <span class="headline">Register Server</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 70vh;overflow-y:auto;">
        <v-layout row wrap>
          <v-flex xs12 sm3>
            <v-subheader>Alias</v-subheader>
          </v-flex>
          <v-flex xs12 sm9 id="server-alias">
            <v-text-field
              name="server-alias"
              label="Server alias"
              v-model="alias"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm3>
            <v-subheader>Server Address</v-subheader>
          </v-flex>
          <v-flex xs12 sm9>
            <v-tabs fixed centered v-model="activeAddressTab">
              <v-tab href="#tab-address-ip">IP Address</v-tab>
              <v-tab href="#tab-address-domain">Domain Name</v-tab>
              <v-tab-item id="tab-address-ip">
                <v-layout row wrap>
                  <v-flex xs12 sm8 id="server-address">
                    <v-text-field
                      name="server-address"
                      label="Server IP Address"
                      v-model="ipAddress"
                      @keypress.native="updateAddress"
                      @paste.native="checkPastingAddress"
                      placeholder="192.168.0.1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 id="server-port">
                    <v-text-field
                      name="server-port"
                      label="Server Port"
                      v-model="port"
                      @input="updatePort"
                      placeholder="27015"
                      mask="#####"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item id="tab-address-domain">
                <v-layout row wrap>
                  <v-flex xs12 sm8 id="server-domain">
                    <v-text-field
                      name="server-domain"
                      label="Server Domain Name"
                      v-model="domainAddress"
                      @keypress.native="updateDomain"
                      @paste.native="checkPastingDomain"
                      placeholder="domain.name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 id="server-port">
                    <v-text-field
                      name="server-port"
                      label="Server Port"
                      v-model="port"
                      @input="updatePort"
                      placeholder="27015"
                      mask="#####"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-flex>

          <v-flex xs12 sm3>
            <v-subheader>Server Icon</v-subheader>
          </v-flex>
          <v-flex xs12 sm9>
            <v-tabs fixed centered v-model="activeIconTab">
              <v-tab href="#tab-icon-image">Image</v-tab>
              <v-tab href="#tab-icon-font">Font</v-tab>
              <v-tab-item id="tab-icon-image">
                <v-layout row wrap>
                  <v-flex xs12 id="server-icon-image">
                    <v-progress-circular
                      v-bind:size="150"
                      v-bind:width="3"
                      v-bind:rotate="fileUploadProgress>0 ? -90 : 0"
                      v-bind:value="isUploading?fileUploadProgress:100"
                      :indeterminate="isUploading?fileUploadProgress<=0:false"
                      color="primary"
                      class="dropbox"
                      :class="{'unloaded':!isFileReady, 'dragging':isDragging}"
                    >
                      <span class="icon-container"><v-icon v-show="!isFileReady">file_upload</v-icon></span>
                      <input type="file" name="server-icon-image" :disabled="isUploading" @change="fileChange($event.target.files);" @dragenter="onDragEnter" @dragleave="onDragLeave" accept="image/*" class="input-file">
                      <transition name="coin-flip">
                        <img class="server-icon-image-preview" :src="imgTempPath" :key="imgTempPath">
                      </transition>
                    </v-progress-circular>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item id="tab-icon-font">
                <v-layout row wrap>
                  <v-flex xs12 sm8 id="server-icon-font">
                    <v-text-field
                      name="server-icon-font"
                      label="Font Classes"
                      v-model="iconFont"
                      placeholder="fas fa-sever"
                      :append-icon="iconFont"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="error" @click.native="closeDialog">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="applyServerData" :disabled="hasInvalidAddress">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>

const STATUS_INITIAL = 0, STATUS_READY = 1, STATUS_UPLOADING = 2, STATUS_SUCCESS = 3, STATUS_FAILED = 4;

export default {
  name: 'server-register',
  props: ['serverData'],
  data () {
    return {
        alias: '',
        activeAddressTab: null,
        activeIconTab: null,
        ipAddress: '',
        domainAddress: '',
        port: '',
        iconImage: null,
        iconFont: '',
        imgTempPath: '',
        currentStatus:null,
        isDragging:false,
        fileUploadProgress: 0,
        editAction: null
    }
  },
  methods: {
    closeDialog: function(){
      this.$emit('close-dialog')
    },
    applyServerData: function() {
      let data = new FormData();

      data.set('displayname', this.alias);
      if(this.activeAddressTab === 'tab-address-ip') {
        data.set('address', this.ipAddress);
      } else if(this.activeAddressTab === 'tab-address-domain') {
        data.set('address', this.domainAddress);
      }

      data.set('port', this.port !== '' ? this.port: '27015');

      if(this.activeIconTab === 'tab-icon-image') {
        if(this.iconImage) {
          this.currentStatus = STATUS_UPLOADING;
          data.set('icon_type', 'image');
          data.set('icon_image_file', this.iconImage);
        }
      }else if(this.activeIconTab === 'tab-icon-font') {
        if(this.iconFont !== '') {
          data.set('icon_type', 'font');
          data.set('icon_content', this.iconFont);
        }
      }

      let url = this.editAction ? '/api/server/edit/' + this.editAction : '/api/server/register/'

      this.$http.post(url, data, {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: progressEvent => {
              this.fileUploadProgress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
            }
          })
      .then( response => {
        this.$emit('action-finish', response.data.message, response.data.error?'error':'success')
        if(!response.data.error) {
          this.$emit('close-dialog')
          this.resetForm()
        }
      })
      .catch( response => { console.log(response) } );
    },
    updateAddress: function(e) {
      if(!/^[0-9]|\.$/.test(e.key)) {
        e.preventDefault()
        return false;
      }

      let address = e.target.value.split('.')

      if(address[address.length-1]+e.key > 255){
        if(address.length < 4) // 4개 이상의 클래스를 적을 수 없다
          address.push(e.key)
        e.preventDefault()
      } else if(address[address.length-1] === '0') {
        if(e.key === '0'){ // 앞머리에 0을 두 개 이상 붙일 수 없다
          if(address.length < 4) // 4개 이상의 클래스를 적을 수 없다
            address.push(e.key) // 다음 클래스에 0을 넣어준다
          e.preventDefault()
        }
        else if(e.key !== '.')// 0도 .도 아닌 다른 숫자일 때, 앞머리에 붙은 0을 제거한다.
          address[address.length-1] = address[address.length-1].slice(1)
      }

      if(e.key === '.')
          if(address.length >= 4) // 4개 이상의 클래스를 적을 수 없다
            e.preventDefault()
          else if(address[address.length-1] === '') // 아무 내용도 없는 클래스를 넣을 수 없다
            e.preventDefault()

      e.target.value = address.join('.')
    },
    updateDomain: function(e) {
      // 도메인 이름에 승인되지않은 문자는 넣을 수 없다.
      if(!/^[A-Za-z0-9\-.]+$/.test(e.key)) {
        e.preventDefault()
        return false;
      } else if(this.domainAddress.length >= 253) { // 전체 길이는 253자 까지 가능하다.
        e.preventDefault()
        return false;
      } else {
        let labels = this.domainAddress.split('.')
        for(let i=0; i<labels.length; i++) {
          if(labels[i].length > 63) { // 각 레이블 당 길이는 63자 까지 가능하다.
            labels[i] = substr(0, 63);
          }
        }
      }
    },
    checkPastingAddress: function(e) {
      let clipboardData, pastedData;

      // 클립보드 내용을 IP에 적합한지 체크 후 붙여넣을지 말지 결정한다.
      clipboardData = e.clipboardData || window.clipboardData;
      pastedData = clipboardData.getData('Text');

      if(!(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(pastedData))) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    checkPastingDomain: function(e) {
      let clipboardData, pastedData;

      // 클립보드 내용을 IP에 적합한지 체크 후 붙여넣을지 말지 결정한다.
      clipboardData = e.clipboardData || window.clipboardData;
      pastedData = clipboardData.getData('Text');

      if(!(/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i.test(pastedData) // 유효한 문자들로 구성되어 있는지 확인한다
      && /^.{1,253}$/.test(pastedData) // 전체 길이를 확인한다.
      && /^[^\.]{1,63}(\.[^\.]{1,63})*$/.test(pastedData))) { // 각 레이블의 길이를 확인한다.
        e.stopPropagation();
        e.preventDefault();
      }
    },
    updatePort: function(value) {
      if(parseInt(value) > 65535) {
        this.port = '65535'
      }
    },
    onDragEnter: function(e){
      this.isDragging = true
    },
    onDragLeave: function(e){
      this.isDragging = false
    },
    resetForm: function() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.iconImage = null;
      this.alias = ''
      this.activeAddressTab= 'tab-address-ip'
      this.activeIconTab= 'tab-icon-image'
      this.ipAddress= ''
      this.domainAddress= ''
      this.port= ''
      this.iconFont= ''
      this.imgTempPath= ''
      this.isDragging=false
      this.fileUploadProgress= 0
    },
    fileChange: function(file) {
      if(file.length > 0) {
        this.iconImage = file[0];
        this.imgTempPath = URL.createObjectURL(file[0]);
        this.currentStatus = STATUS_READY;
      }
    }
  },
  computed: {
    hasInvalidAddress: function() {
      if(this.activeAddressTab === 'tab-address-ip') {
        return (!(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(this.ipAddress)))
      } else if(this.activeAddressTab === 'tab-address-domain') {
        return (!(/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i.test(this.domainAddress) // 유효한 문자들로 구성되어 있는지 확인한다
            && /^.{1,253}$/.test(this.domainAddress) // 전체 길이를 확인한다.
            && /^[^\.]{1,63}(\.[^\.]{1,63})*$/.test(this.domainAddress))) // 각 레이블의 길이를 확인한다.
      }
      return true
    },
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isFileReady() {
      return this.currentStatus === STATUS_READY;
    },
    isUploading() {
      return this.currentStatus === STATUS_UPLOADING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  mounted: function() {
    this.resetForm()
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#server-icon-font .icon {
  color:#2c3e50 !important;
}

.dropbox {
  position: relative;
  overflow:hidden;
  transform-style: preserve-3d;
}

.dropbox .progress-circular__info {
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  border-radius: 50%;
  overflow: hidden;
}

.dropbox .progress-circular__info span.icon-container {
  position:absolute;
  left:0px;
  top:0px;
  width: 100%;
  height: 100%;
  text-align: center;
  pointer-events: none;
  line-height: 900%;
  z-index:3;
}

.dropbox .progress-circular__info .icon {
  position: absolute;
  transform: translate(-50%,-50%);
  font-size: 6em;
  color: #1976D2 !important;
  pointer-events: none;
  transition: font-size 150ms ease-in;
}

.dropbox.dragging .progress-circular__info .icon {
  font-size: 9em;
}

.dropbox .progress-circular__info .server-icon-image-preview {
  position:absolute;
  left:0px;
  top:0px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
  transition: transform 0.6s ease-in-out, background 150ms ease-in;
  z-index:1;
}

.dropbox.dragging .progress-circular__info .server-icon-image-preview {
  background:#77f;
}

.dropbox .input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  left:0px;
  top:0px;
  position: absolute;
  cursor: pointer;
  z-index:2;
}

.coin-flip-enter {
  transform: rotateY(180deg);
}

.coin-flip-enter-to {
  transform: rotateY(0deg);
}

.coin-flip-leave-active {
  transform: rotateY(-180deg);
}
</style>
