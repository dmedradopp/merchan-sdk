import StandardService from '../standard-service'
import { smartstore } from 'react-native-force'

export default class VersionService extends StandardService {
    
    constructor() {
        super()
        this.SoapName = 'Version__c'
        this.SalesforceObj = 'Version__c'
        this.SalesforceObjName = 'Versão'
        this.IndexSpecs = [ 
            {path:"Id", type:"full_text"}, 
            {path:"Name", type:"full_text"},
            {path:"Current__c", type:"full_text"},
            {path:"EmailSupport__c", type:"full_text"},
            {path:"__local__", type:"full_text"} 
        ]
        this.SyncFieldList = [
            'Id',
            'Name',
            'Current__c',
            'EmailSupport__c'
        ]
        this.UpsrFieldList = []
    }

    get soqlSync() {
        return `SELECT ${this.SyncFieldList.join(",")} FROM ${this.SalesforceObj}`
    }

    getCurrentVersionAsync() {
        return new Promise((resolve, rejected) => {
            let query = smartstore.buildSmartQuerySpec(`SELECT {${this.SalesforceObj}:Id}, {${this.SalesforceObj}:Current__c}, {${this.SalesforceObj}:EmailSupport__c} FROM {${this.SalesforceObj}}`);

            smartstore.runSmartQuery(false, query, resolve, rejected);
        });
    }
}