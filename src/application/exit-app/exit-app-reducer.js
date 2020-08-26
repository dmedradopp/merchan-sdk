import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'

// Actions Types
export const EXIT_APP_OVERLAY = defineAction('EXIT_APP_OVERLAY', ['DISPLAY_OVERLAY'], 'MODAL DE SAÍDA DA APLICAÇÃO')

//Actions
export const showHideExitAppOverlay = createAction(EXIT_APP_OVERLAY.DISPLAY_OVERLAY)

const initialState = {
  exitAppOverlay: false
}

export default function exitAppReducer(state = initialState, action) {
  switch (action.type) {
    case EXIT_APP_OVERLAY.DISPLAY_OVERLAY:
      return { 
          ...state,
          exitAppOverlay: state.exitAppOverlay ? false : true
      }

    default:
      return state
  }
}