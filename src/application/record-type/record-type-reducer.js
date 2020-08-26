import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'

const LOADING_RECORD_TYPES = defineAction('LOADING_RECORD_TYPES', ['START', 'FINISH'], 'CARREGANDO OS TIPOS DE REGISTROS')

export const recordTypesLoadingStart = createAction(LOADING_RECORD_TYPES.START)
export const recordTypesLoadingFinish = createAction(LOADING_RECORD_TYPES.FINISH, returns => 
  ({ recordTypes : returns.currentPageOrderedEntries }))

const initialState = {
  objects: {}
}

export default function recordTypeReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_RECORD_TYPES.FINISH:
      let mapObjects = {}
      
      action.payload.recordTypes.map((recordType) => {
        let found = false

        if(recordType.SobjectType in mapObjects){
          mapObjects[recordType.SobjectType][recordType.DeveloperName] = recordType
          found = true
        }
        
        if (!found){
          mapObjects[recordType.SobjectType] = { }
          mapObjects[recordType.SobjectType][recordType.DeveloperName] = recordType
        }
      })
      
      return {
        ...state,
        objects: mapObjects
      }

    default:
      return state;
  }
}