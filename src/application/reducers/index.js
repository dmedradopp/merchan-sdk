import { combineReducers } from 'redux'
import navigator from '../navigator/navigator-reducer'
import user from '../user/user-reducer'
import recordType from '../record-type/record-type-reducer'
import synchronizationService from '../sync/sync-reducer'

var rootReducers = {}

export function RegisterReducer(reducer) { 
    reducer = {...reducer, navigator, user, recordType, synchronizationService}
    Object.assign(rootReducers, reducer)
}

export default rootReducers