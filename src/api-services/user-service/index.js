import StandardService from '../standard-service'

export default class UserService extends StandardService {
    
    constructor() {
        super()
        this.SoapName = 'User'
        this.SalesforceObj = 'User'
        this.SalesforceObjName = 'Usuário'
        this.IndexSpecs = [ 
            {path:"Id", type:"full_text"}, 
            {path:"Name", type:"full_text"}, 
            {path:"LastName", type:"full_text"}, 
            {path:"Email", type:"full_text"}, 
            {path:"Username", type:"full_text"},
            {path:"ProfileId__c", type:"full_text"},
            {path:"ProfileName__c", type:"full_text"}, 
            {path:"__local__", type:"full_text"} 
        ]
        this.SyncFieldList = [
            'Id',
            'Name',
            'LastName',
            'Email',
            'Username',
            'ProfileId__c',
            'ProfileName__c',
            'IsActive',
            'MobilePhone',
            'EmployeeNumber'
        ]
        this.UpsrFieldList = []
    }

    get soqlSync() {
        return `SELECT ${this.SyncFieldList.join(",")} FROM ${this.SalesforceObj} WHERE IsActive = true`
    }
}