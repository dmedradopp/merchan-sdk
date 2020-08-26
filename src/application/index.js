import React from 'react'
import { AsyncStorage } from 'react-native'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers } from 'redux'
import { createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { fork, all } from 'redux-saga/effects'
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers'
import Reactotron from 'reactotron-react-native'
import sagaPlugin from 'reactotron-redux-saga';
import moment from 'moment';

import reducer from './reducers';
import AppNavigationState from './navigator/navigator-container'
import { splashSagas } from '../containers/splash';
import themeDefault from '../themes/premier-pet'
import { startSync, synchronizationBaseEnd, synchronizationLoadingEnd } from '../application/sync/sync-reducer'

var rootSagas = []
var AppNavigator = {}
var UserService = {}
var RecordTypeService = {}
var Theme = themeDefault
var store = {}
var persistor = {}

function RegisterUserService(service) {
    UserService = service
}

function RegisterRecordTypeService(service) {
    RecordTypeService = service
}

function SetTheme(theme) {
    Theme = theme
}

function* rootSaga() {
    yield all(rootSagas)
}

function rehydrationFinish() {
    const state = store.getState();
    
    if(state.synchronizationService.lastSync == null) {
        store.dispatch(startSync());
    }
    else if(state.synchronizationService.lastSync != null) {
        const dateSync = new Date(state.synchronizationService.lastSync);
        dateSync.setHours(0);
        dateSync.setMinutes(0);
        dateSync.setSeconds(0);
        dateSync.setMilliseconds(0);

        const dateToday = new Date();
        dateToday.setHours(0);
        dateToday.setMinutes(0);
        dateToday.setSeconds(0);
        dateToday.setMilliseconds(0);
        
        if(dateSync < dateToday) {
            store.dispatch(startSync());
        }
    }
}

function localCreateStore(data = {}) {
    RegisterSaga(fork(splashSagas))

    var sagaMiddleware = null

    if(__DEV__) { 
        Reactotron
            .setAsyncStorageHandler(AsyncStorage)
            .configure()
            .use(sagaPlugin())
            .useReactNative()
            .connect();

        const sagaMonitor = Reactotron.createSagaMonitor();

        sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    }
    else {
        sagaMiddleware = createSagaMiddleware();
    }

    const reactNavigationReduxMiddlewares = createReactNavigationReduxMiddleware("root", state => state.nav)

    const store = createStore(combineReducers(reducer), data, composeWithDevTools(
        applyMiddleware(sagaMiddleware),
        applyMiddleware(reactNavigationReduxMiddlewares),
    ))

    sagaMiddleware.run(rootSaga)
    return { store }
}

function RegisterSaga(saga) {
    rootSagas.push(saga)
}

function RegisterAppNavigator(appnav) {
    AppNavigator = appnav
}

export {
    store,
    persistor,
    AppNavigator,
    RegisterSaga,
    UserService,
    RecordTypeService,
    RegisterAppNavigator,
    RegisterUserService,
    RegisterRecordTypeService,
    Theme,
    SetTheme
}

async function init() {
    const lastSync = await AsyncStorage.getItem('dateLastSynchronization');

    if(lastSync == null) {
        store.dispatch(startSync());
    }
    else if(lastSync != null) {
        const dateSync = getDate(lastSync);
        dateSync.setHours(0);
        dateSync.setMinutes(0);
        dateSync.setSeconds(0);
        dateSync.setMilliseconds(0);

        const dateToday = new Date();
        dateToday.setHours(0);
        dateToday.setMinutes(0);
        dateToday.setSeconds(0);
        dateToday.setMilliseconds(0);
        
        if(dateSync < dateToday) {
            store.dispatch(startSync());
        }
        else {
            store.dispatch(synchronizationBaseEnd());

            setTimeout(function() {
                store.dispatch(synchronizationLoadingEnd({ status: 'Finalizado' }));
            }, 2000);
        }
    }
    else {
        store.dispatch(synchronizationBaseEnd());
        
        setTimeout(function() {
            store.dispatch(synchronizationLoadingEnd({ status: 'Finalizado' }));
        }, 2000);
    }
}

function getDate(strDate) {
    return moment(strDate, 'DD/MM/YYYY - HH:mm', true).toDate();
}

export default class App extends React.Component {
    render() {
        const result = localCreateStore();

        store = result.store; 

        const addListener = createReduxBoundAddListener("root");

        init();

        return (
            <Provider store={store}>
                <AppNavigationState AppNavigator={AppNavigator} AddListener={addListener} />
            </Provider>
        )
    }
}

