import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'

// Actions Types
export const ERROR_MESSAGE_EXCEPTION_OVERLAY = defineAction('ERROR_MESSAGE_EXCEPTION_OVERLAY', ['DISPLAY_OVERLAY', 'SET_ERROR'], 'MODAL DE ERRO')

//Actions
export const showHideErrorMessageExceptionOverlay = createAction(ERROR_MESSAGE_EXCEPTION_OVERLAY.DISPLAY_OVERLAY)
export const setErrorMessageExceptionOverlay = createAction(ERROR_MESSAGE_EXCEPTION_OVERLAY.SET_ERROR)

const initialState = {
  errorMessageExceptionOverlay: false,
  errorName: 'Nome do erro',
  errorDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie consequat massa vel semper. Morbi euismod scelerisque molestie. Donec at euismod nulla, ac interdum lectus. In hac habitasse platea dictumst. Proin faucibus felis enim, non iaculis dui cursus at. Mauris pretium elit non leo eleifend laoreet. Etiam nisi odio, accumsan a nunc sit amet, suscipit porttitor orci. Donec finibus nibh eu turpis viverra congue. Nullam sodales augue arcu, sed aliquam nisi varius et. Integer bibendum scelerisque lorem sed fermentum. Duis fermentum at tortor a pellentesque. Pellentesque sollicitudin, sapien in rhoncus rhoncus, turpis diam sollicitudin nunc, eu venenatis diam lectus placerat tortor.'
}

export default function errorExceptionReducer(state = initialState, action) {
  switch (action.type) {
    case ERROR_MESSAGE_EXCEPTION_OVERLAY.DISPLAY_OVERLAY:
      return { 
          ...state,
          errorMessageExceptionOverlay: state.errorMessageExceptionOverlay ? false : true
      }

    case ERROR_MESSAGE_EXCEPTION_OVERLAY.SET_ERROR:
      return { 
          ...state,
          errorName: action.payload.error.errorName,
          errorDescription: action.payload.error.errorDescription
      }

    default:
      return state
  }
}