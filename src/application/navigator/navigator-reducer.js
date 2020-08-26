import { NavigationActions } from 'react-navigation'
import { AppNavigator } from '../../application/index'
import { PROGRESS } from '../../containers/splash'
import { MENU } from '../../components/button-menu'
import { defineAction } from 'redux-define'
import { createAction } from 'redux-actions'

export const LAST_ROUTE = defineAction('LAST_ROUTE', ['NAME'], 'SALVAR O NOME DA ULTIMA ROTA')

export const setLastRouteName = createAction(LAST_ROUTE.NAME)


export default function navigatorReducer(state = null, action) {

  /*if (!state) {
    state = AppNavigator.router.getStateForAction(
      AppNavigator.router.getActionForPathAndParams('Splash')
    )
  }*/

  switch (action.type) {

    case PROGRESS.START:
      const navigationSyncAction = NavigationActions.navigate({ routeName: 'SynchronizationProgress', key: 'SynchronizationProgress' })
      return AppNavigator.router.getStateForAction(navigationSyncAction, state)

    case PROGRESS.STOP:
      
      let navigationSyncEndAction = null;

      if(action.payload) {
        navigationSyncEndAction = NavigationActions.navigate({
          routeName: 'IncorrectVersion', key: 'IncorrectVersion'
        })
      }
      else {
        navigationSyncEndAction = NavigationActions.navigate({
          routeName: 'MenuScreens', key: 'MenuScreens',
          action: NavigationActions.navigate({ 
            routeName: state.menuName == undefined ? 'Home' : 'Synchronization', 
            key: state.menuName == undefined ? 'Home' : 'Synchronization' })
        })
      }

      return AppNavigator.router.getStateForAction(navigationSyncEndAction, state)

    case MENU.OPEN:
      const navigationAction = NavigationActions.navigate({ routeName: 'DrawerOpen' })
      return AppNavigator.router.getStateForAction(navigationAction, state)

    case LAST_ROUTE.NAME:
      return { 
        ...state,
        menuName: action.payload.menuName,
        firstLevelName: action.payload.firstLevelName ? action.payload.firstLevelName : null,
        secondLevelName: action.payload.secondLevelName ? action.payload.secondLevelName : null,
        thirdLevelName: action.payload.thirdLevelName ? action.payload.thirdLevelName : null
      }
      
    default:
      const nextState = AppNavigator.router.getStateForAction(action, state);
      if (nextState)
      {
        return nextState;        
      }
      return state;
  }
}