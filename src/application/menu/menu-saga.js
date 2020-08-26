import { oauth } from 'react-native-force'
import { call, put } from 'redux-saga/effects'
import { menuLoadingStart, menuLoadingStop } from './menu-reducer'
import { UserService } from '../../application'

function getAuthCredentials() {
    return new Promise((fulfilled, rejected) => { 
        oauth.getAuthCredentials(fulfilled, (ex) => {
            rejected(`Erro ao recuperar informações do Usuário! - ${ex}`)
        })
    })
}

function UserGetById(id) { 
    return UserService.getById(id)
}

export function* menuLoading() {
    yield put(menuLoadingStart())
    const authData = yield call(getAuthCredentials)
    const user = yield call(UserGetById, authData.userId)
    const userInfo = { UserName : user.Name, UserEmail : user.Email, UserId : authData.userId }
    yield put(menuLoadingStop(userInfo))
}