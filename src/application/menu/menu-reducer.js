import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'
import { oauth } from 'react-native-force'
import { store } from '../../application'
import { dispatch } from 'redux'

const LOADING = defineAction('LOADING', ['START', 'STOP'], 'MENU');
const SET = defineAction('SET', ['USER'], 'SETAR ID DO USUÁRIO');
const LAST_ROUTE = defineAction('LAST_ROUTE', ['NAME'], 'Salva o nome da ultima rota');

export const menuLoadingStart = createAction(LOADING.START);
export const menuLoadingStop = createAction(LOADING.STOP);
export const setUser = createAction(SET.USER);
export const setLastRouteName = createAction(LAST_ROUTE.NAME);

this.userId = 'Não Identificado';

async function getUserId(){   
  let authData

  await oauth.getAuthCredentials((success) => {
    authData = success
    let userId = authData.userId
    store.dispatch(setUser({ user: userId }))
  }, (ex) => {
    console.log(`Erro ao recuperar informações do Usuário! - ${ex}`)
    rejected(`Erro ao recuperar informações do Usuário! - ${ex}`)
  })
}

getUserId()

const initialState = {
  UserName : this.userId,
  UserEmail : 'Sem E-mail',
  UserId : this.userId,
  lastRouteName : 'Home'
}

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING.STOP:
      return {...state, UserName : action.payload.UserName, UserEmail : action.payload.UserEmail, UserId : action.payload.UserId };

    case SET.USER:
      return {...state, UserName : 'ID: ' + action.payload.user, UserEmail : action.payload.user, UserId : action.payload.user };

    case LAST_ROUTE.NAME:
      return { 
        ...state,
        lastRouteName: action.payload.routeName
      };
      
    default:
      return state;
  }
}
