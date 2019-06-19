import axios from 'axios'
import Cookies from 'js-cookie';
import decodeJWT from 'jwt-decode';
import * as types from '../mutation-types'

// state
export const state = {
  authenticated: false,
  token: null,
  user: null
/*  get user () {
    if(this.authenticated)
      return decodeJWT(this.token);
    else
      return null;
  }*/
}

/*
get user () {
  if(this.authenticated)
    return decodeJWT(this.token);
  else
    return null;
}
*/

// getters
export const getters = {
  authenticated: state => state.authenticated,
  token: state => state.token,
  user: state => state.user
}

// mutations
export const mutations = {
  [types.LOGIN] (state, token) {
    state.token = token
    state.user = decodeJWT(token)
    // authenticated를 watcher로 등록해두고 인증시 발동하도록 설정해놓은 것이 있으니 맨 마지막에 놓자.
    state.authenticated = true
  },

  [types.LOGOUT] (state) {
    state.authenticated = false
    state.user = null
    state.token = null
  }
}

// actions
export const actions = {
  login ({ commit, dispatch }, payload) {
    commit(types.LOGIN, payload)
  },

  async logout ({ commit }) {
    try {
      await axios.get('/api/user/logout')
    } catch (e) { }

    commit(types.LOGOUT)
  },

  async validate({ commit }) {
    let token;
    try {
      await axios.get('/api/auth/renew').then(response => {
        if(response.data.success) {
          token = response.headers.authorization.split(' ')[1]
        } else {
          commit(types.LOGOUT)
        }
      });
    } catch (e) { }
    if(token) {
      commit(types.LOGIN, token)
    }
  }
}
