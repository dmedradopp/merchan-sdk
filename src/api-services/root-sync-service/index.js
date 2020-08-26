import { AsyncStorage } from "react-native"
import { smartstore, smartsync } from 'react-native-force'
import _ from 'lodash'
import { store } from '../../application'
import {
    synchronizationLoadingProgress, synchronizationLoadingEnd, synchronizationLoadingError, buttonCancelVisibility,
    synchronizationBackgroundStart, synchronizationBackgroundEnd,
    synchronizationBaseEnd
} from '../../application/sync/sync-reducer'
import reactotron from 'reactotron-react-native'
import * as Tracker from '../../containers/issue-tracker';

class RootSyncService {

    constructor() {
        this.Services = []
        this.SyncName = 'MobiSales'
        this.SyncInFlight = false
        this.syncService = this.syncService.bind(this)
    }

    get services() {
        return this.Services
    }

    get syncInFlight() {
        return this.SyncInFlight
    }

    addSyncService(service) {
        this.Services.push(service)
    }

    getSyncStatus(service) {
        return new Promise((fulfilled, rejected) => {
            smartsync.getSyncStatus(false, service.soapName, fulfilled, (ex) => { rejected(`Erro ao recuperar status sincronização. - ${ex}`) })
        })
    }

    registerSoup(service) {
        return new Promise((fulfilled, rejected) => {
            smartstore.registerSoup(false, service.soapName, service.IndexSpecs, fulfilled, (ex) => {
                rejected(`Erro ao registrar o Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
            })
        })
    }

    soupExists(service) {
        return new Promise((fulfilled, rejected) => {
            smartstore.soupExists(false, service.soapName, fulfilled, (ex) => {
                rejected(`Erro ao verificar o Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
            })
        })
    }

    async initialSyncData(service) {
        return new Promise(async (fulfilled, rejected) => {
            try {
                if(service.FullReSync) {
                    if(service.beforeSync)
                        await service.beforeSync()
                }

                await this.syncDown(service)
                fulfilled()
            }
            catch (ex) {
                rejected(ex)
            }
        })
    }

    syncDown(service) {
        return new Promise((fulfilled, rejected) => {
            let target = { type: "soql", query: service.soqlSync }
            let options = { mergeMode: service.mergeMode }
            smartsync.syncDown(false, target, service.soapName, options, service.soapName, fulfilled, (ex) => {
                rejected(`Erro ao efetuar download do Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
            })
        })
    }

    syncUp(service) {
        if (service.crtFieldList != undefined && service.crtFieldList.length >= 1) {
            return new Promise((fulfilled, rejected) => {
                smartsync.syncUp(false, { createFieldlist: service.crtFieldList, updateFieldlist: service.upsrFieldList }, service.soapName, { mergeMode: service.mergeMode }, fulfilled, (ex) => {
                    rejected(`Erro ao efetuar o upload do Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
                })
            })
        } else {
            return new Promise((fulfilled, rejected) => {
                smartsync.syncUp(false, {}, service.soapName, { mergeMode: service.mergeMode, fieldlist: service.upsrFieldList }, fulfilled, (ex) => {
                    rejected(`Erro ao efetuar o upload do Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
                })
            })
        }

    }

    reSync(service) {
        return new Promise(async (fulfilled, rejected) => {
            if(!service.FullReSync) {
                smartsync.reSync(false, service.soapName, fulfilled, (ex) => {
                    Tracker.captureException(ex);
                    rejected(`Erro ao resincronizar o Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
                })
            }
            else {
                if(service.beforeSync)
                    await service.beforeSync()

                smartsync.deleteSync(false, service.soapName, (s) => {
                    let target = { type: "soql", query: service.soqlSync }

                    smartsync.syncDown(false, target, service.soapName, {}, service.soapName, fulfilled, (ex) => {
                        rejected(`Erro ao resincronizar o Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
                    })
                }, (ex) => {
                    Tracker.captureException(ex);
                    rejected(`Erro ao resincronizar o Objeto ${service.SalesforceObjName} no Aplicativo - ${ex}`)
                })
            }
        })
    }

    async reSyncData(service) {
        return new Promise(async (fulfilled, rejected) => {
            try {
                await this.syncUp(service)
                let data = await this.reSync(service)
                
                smartsync.cleanResyncGhosts(false, data._soupEntryId,
                    function () { /*console.log('cleanResyncGhosts success for soup  ' + data.soupName)*/ },
                    function () { /*console.log('cleanResyncGhosts failed for soup  ' + data.soupName)*/ })
                fulfilled()
            }
            catch (ex) {
                rejected(ex)
            }
        })
    }

    async syncService(service) {
        const sync = await this.getSyncStatus(service)

        if (sync == null) {

            store.dispatch(buttonCancelVisibility())
            await this.initialSyncData(service)

        } else {

            if (service.beforeResync)
                await service.beforeResync()

            await this.reSyncData(service)

            if (service.afterResync)
                await service.afterResync()
        }
    }

    async syncAllData() {
        if (this.SyncInFlight) return

        this.SyncInFlight = true

        let i = 0
        let num = 0.9
        let progress = 0.0
        let status = 'Sincronizando...'
        let synchronizationProgress = false

        try {
            for (i = 0; i < this.Services.length; i++) {
                let service = this.Services[i]
                const exist = await this.soupExists(service)
                if (!exist) await this.registerSoup(service)
            }

            for (i = 0; i < this.Services.length; i++) {
                let service = this.Services[i]

                //Momento em que termina de sincronizar os objetos principais (User e RecordType)
                if (i == 2)
                    store.dispatch(synchronizationBaseEnd())

                progress = num / this.Services.length
                status = 'Sincronizando o Objeto ' + service.SalesforceObjName
                synchronizationProgress = true

                store.dispatch(synchronizationLoadingProgress({
                    progress,
                    status,
                    synchronizationProgress,
                }))

                await this.syncService(service)

                if (store.getState().synchronizationService.synchronizationProgress == false) {
                    this.SyncInFlight = false
                    return
                }

                num++
            }
        } catch (ex) {
            Tracker.captureException(ex);

            reactotron.log(ex);

            store.dispatch(synchronizationLoadingError({
                progress: 0.0,
                status: ex + ' Motivo: Houve um erro. Verifique sua conexão com a internet'
            }))

            store.dispatch(synchronizationBaseEnd())

            this.SyncInFlight = false

            return
        }

        let dateLastSynchronization = new Date()

        var day = dateLastSynchronization.getDate();
        var month = dateLastSynchronization.getMonth() + 1; //Janeiro é 0
        var year = dateLastSynchronization.getFullYear();
        var hour = dateLastSynchronization.getHours();
        var minute = dateLastSynchronization.getMinutes();

        if (day < 10) { day = '0' + day }
        if (month < 10) { month = '0' + month }
        if (hour < 10) { hour = '0' + hour }
        if (minute < 10) { minute = '0' + minute }

        dateLastSynchronization = day + '/' + month + '/' + year + ' - ' + hour + ':' + minute

        await AsyncStorage.setItem('dateLastSynchronization', dateLastSynchronization)

        store.dispatch(synchronizationLoadingEnd({ progress: 100.0, status: 'Sincronização realizada com sucesso', buttonCancelVisibility: false }))
        this.SyncInFlight = false
    }

    async syncServicesData(myServices) {
        if (this.SyncInFlight) return

        this.SyncInFlight = true
        store.dispatch(synchronizationBackgroundStart({ progress: 0, status: 'Sincronizando em segundo plano...' }))

        let i = 0
        try {
            for (i = 0; i < myServices.length; i++) {
                let service = myServices[i]
                await this.syncService(service)
            }
        } catch (ex) {
            store.dispatch(synchronizationLoadingError({ progress: 0, status: ex }))
            console.error('Erro ao sincronizar em background: ' + ex)
        }

        store.dispatch(synchronizationBackgroundEnd({ progress: 0, status: 'Sincronização em segundo plano realizada com sucesso' }))
        this.SyncInFlight = false
    }

}

const SyncService = new RootSyncService()

export function syncAllData() {
    SyncService.syncAllData()
}

export function syncServicesData(myServices) {
    SyncService.syncServicesData(myServices)
}

export function addSyncService(service) {
    SyncService.addSyncService(service)
}
