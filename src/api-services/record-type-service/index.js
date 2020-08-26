import StandardService from '../standard-service'

export default class RecordTypeService extends StandardService {
    
    constructor() {
        super()
        this.SoapName = 'RecordType'
        this.SalesforceObj = 'RecordType'
        this.SalesforceObjName = 'Tipo de registro'
        this.IndexSpecs = [ 
            {path:"Id", type:"full_text"}, 
            {path:"Name", type:"full_text"}, 
            {path:"DeveloperName", type:"full_text"}, 
            {path:"SobjectType", type:"full_text"}, 
            {path:"__local__", type:"full_text"} 
        ]
        this.SyncFieldList = ['Id', 'Name', 'DeveloperName', 'SobjectType']
        this.UpsrFieldList = []
        this.SoqlSync = `SELECT ${this.SyncFieldList.join(",")} FROM ${this.SalesforceObj}`
    }
}