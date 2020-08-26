import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'
import { REHYDRATE } from 'redux-persist';

export const SYNCHRONIZATION_LOADING = defineAction('SYNCHRONIZATION_LOADING', ['PROGRESS', 'END', 'CANCEL', 'ERROR'], 'SINCRONIZAÇÃO DA APLICAÇÃO')
export const SYNCHRONIZATION_BACKGROUND = defineAction('SYNCHRONIZATION_BACKGROUND', ['START', 'END', 'ERROR'], 'SINCRONIZAÇÃO EM BACKGROUND')
export const SYNCHRONIZATION_BASE = defineAction('SYNCHRONIZATION_BASE', ['END'], 'SINCRONIZAÇÃO DOS OBJETOS PRINCIPAIS')
export const BUTTON_CANCEL = defineAction('BUTTON_CANCEL', ['VISIBILITY'], 'BOTÃO DE CANCELAR SINCRONIZAÇÃO')
export const UDPATE_PENDING_SYNC = defineAction('UDPATE_PENDING_SYNC', ['SET', 'UNSET'], 'SINCRONIZAÇÃO')
export const SYNCHRONIZATION_START_SYNC = defineAction('SYNCHRONIZATION_START_SYNC', ['START'], 'SINCRONIZAÇÃO')

export const startSync = createAction(SYNCHRONIZATION_START_SYNC.START)
export const synchronizationLoadingProgress = createAction(SYNCHRONIZATION_LOADING.PROGRESS)
export const synchronizationLoadingEnd = createAction(SYNCHRONIZATION_LOADING.END)
export const synchronizationLoadingCancel = createAction(SYNCHRONIZATION_LOADING.CANCEL)
export const synchronizationLoadingError = createAction(SYNCHRONIZATION_LOADING.ERROR)
export const synchronizationBackgroundStart = createAction(SYNCHRONIZATION_BACKGROUND.START)
export const synchronizationBackgroundEnd = createAction(SYNCHRONIZATION_BACKGROUND.END)
export const synchronizationBaseEnd = createAction(SYNCHRONIZATION_BASE.END)
export const buttonCancelVisibility = createAction(BUTTON_CANCEL.VISIBILITY)
export const setSyncPending = createAction(UDPATE_PENDING_SYNC.SET)
export const unsetSyncPending = createAction(UDPATE_PENDING_SYNC.UNSET)

const initialState = {
  lastSync: null,
  progress: 0,
  status: 'Iniciando Sincronização',
  synchronizationProgress: false,
  synchronizationBackground: false,
  buttonCancelVisibility: false
}

export default function synchronizationServiceReducer(state = initialState, action) {
  switch (action.type) {
    case SYNCHRONIZATION_LOADING.PROGRESS:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status,
        synchronizationProgress: action.payload.synchronizationProgress,
        buttonCancelVisibility: false
      }
    case SYNCHRONIZATION_LOADING.END:
      return {
        ...state,
        progress: 0,
        status: action.payload.status,
        synchronizationProgress: false,
        buttonCancelVisibility: false,
        synchronizationBackground: false
      }

    case SYNCHRONIZATION_LOADING.CANCEL:
      return {
        ...state,
        progress: 0,
        status: 'Sincronização cancelada.',
        synchronizationProgress: false,
        buttonCancelVisibility: false,
        synchronizationBackground: false
      }

    case SYNCHRONIZATION_LOADING.ERROR:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status,
        synchronizationProgress: false,
        buttonCancelVisibility: true
      }

    case SYNCHRONIZATION_BACKGROUND.START:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status,
        synchronizationProgress: false,
        buttonCancelVisibility: false,
        synchronizationBackground: true
      }

    case SYNCHRONIZATION_BACKGROUND.END:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status,
        synchronizationProgress: false,
        buttonCancelVisibility: false,
        synchronizationBackground: false
      }

    case SYNCHRONIZATION_BACKGROUND.ERROR:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status,
        synchronizationProgress: false,
        buttonCancelVisibility: false,
        synchronizationBackground: false
      }
    case BUTTON_CANCEL.VISIBILITY:
      return {
        ...state,
        buttonCancelVisibility: false
      }
    case UDPATE_PENDING_SYNC.SET:
      return {
        ...state,
        lastSync: null
      }

    case UDPATE_PENDING_SYNC.UNSET:
      return {
        ...state,
        lastSync: new Date()
      }
    case SYNCHRONIZATION_START_SYNC.START:
      return {
        ...state
      }

    default:
      return state;
  }
}
