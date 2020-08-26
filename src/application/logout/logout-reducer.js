import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'

// Actions Types
export const LOGOUT_OVERLAY = defineAction('LOGOUT_OVERLAY', ['DISPLAY_OVERLAY'], 'MODAL DE LOGOUT')

//Actions
export const showHideLogoutOverlay = createAction(LOGOUT_OVERLAY.DISPLAY_OVERLAY)

const initialState = {
  logoutOverlay: false
}

export default function logoutReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT_OVERLAY.DISPLAY_OVERLAY:
      return { 
          ...state,
          logoutOverlay: state.logoutOverlay ? false : true
      }

    default:
      return state
  }
}