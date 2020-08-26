'use strict'
import { smartstore, oauth } from 'react-native-force'
import _ from 'lodash'
import { addSyncService } from '../root-sync-service'

export const MERGE_MODE = {
    OVERWRITE: "OVERWRITE",
    LEAVE_IF_CHANGED: "LEAVE_IF_CHANGED"
}

export default class StandardService {

    constructor() {
        this.SoapName = ''
        this.SalesforceObj = ''
        this.SalesforceObjName = ''
        this.IndexSpecs = []
        this.SyncFieldList = []
        this.UpsrFieldList = []
        this.CrtFieldList = []
        this.userId = 'Não definido'
        this.SoqlSync = `SELECT ${this.SyncFieldList.join(",")} FROM ${this.SalesforceObj}`
        this.MergeMode = MERGE_MODE.OVERWRITE
        addSyncService(this)
        this.getUserId()
        
        this.getUserId = this.getUserId.bind(this)
        this.searchAllFields = this.searchAllFields.bind(this)
        this.searchByFilter = this.searchByFilter.bind(this)
        this.searchByRange = this.searchByRange.bind(this)
        this.searchRelatedLists = this.searchRelatedLists.bind(this)
        this.getById = this.getById.bind(this)
        this.save = this.save.bind(this)
    }

    get salesforceObj() { return this.SalesforceObj }
    get soapName() { return this.SoapName }
    get indexSpecs() { return this.IndexSpecs }
    get syncFieldList() { return this.SyncFieldList }
    get upsrFieldList() { return this.UpsrFieldList }
    get crtFieldList() { return this.CrtFieldList }
    get soqlSync() { return this.SoqlSync }
    get mergeMode() { this.MergeMode }

    async getUserId(){        
        let authData = await this.getAuthCredentials()
        
        this.userId = authData.userId
    }
    
    getAuthCredentials() {
        return new Promise((fulfilled, rejected) => { 
            oauth.getAuthCredentials(fulfilled, (ex) => {
                rejected(`Erro ao recuperar informações do Usuário! - ${ex}`)
            })
        })
    }

    searchAllFields(orderBy = 'Id', order = 'ascending', limit = 500, filter = '') {
        console.log('searchAllFields');
        
        let IgnoredFields = ['Id', 'CreatedDate', '__local__']
        let querySpec
        let match = ''
        let index = 0

        if (filter === '')
            querySpec = smartstore.buildAllQuerySpec(orderBy, order, limit)

        else {
            _.each(this.IndexSpecs, element => {
                if ( _.includes(IgnoredFields, element.path) ) return
                if (index > 0) match += ' OR '
                match += `{${this.SoapName}:${element.path}}:${filter}*`
                index++
            })

            querySpec = smartstore.buildMatchQuerySpec(null, match, order, limit, orderBy)
        }
        
        return new Promise((fulfilled, rejected) => {   
            smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
        })
    }

    searchByFilter(orderBy = 'Id', order = 'ascending', limit = 500, filters = '', operator = ' OR ', spliter = '-') {
        console.log('searchByFilter');
        
        let querySpec
        let match = ''
        let index = 0
        if (filters.length === 0)
            querySpec = smartstore.buildAllQuerySpec(orderBy, order, limit)
            
        else {
            _.each(filters, filter => {
                if (index > 0) match += ' ' + operator + ' '
                match += `{${this.SoapName}:${filter.split(spliter)[0]}}:${filter.split(spliter)[1]}*`
                index++
            })
            
            querySpec = smartstore.buildMatchQuerySpec(null, match, order, limit, orderBy)
        }
        return new Promise((fulfilled, rejected) => { 
            smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
        })
    }

    searchByExactFilter(orderBy = 'Id', order = 'ascending', limit = 500, filters = '', operator = ' OR ', spliter = '-') {
        let querySpec
        let match = ''
        let index = 0
        if (filters.length === 0)
            querySpec = smartstore.buildAllQuerySpec(orderBy, order, limit)
            
        else {
            _.each(filters, filter => {
                if (index > 0) match += ' ' + operator + ' '
                match += `{${this.SoapName}:${filter.split(spliter)[0]}}:${filter.split(spliter)[1]}*`
                index++
            })
            
            querySpec = smartstore.buildExactQuerySpec(null, match, limit, order, orderBy)
        }
        return new Promise((fulfilled, rejected) => { 
            smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
        })
    }

    // searchByRangeAndMatch(searchedField, startRange, endRange, filters = '', order = 'ascending', limit = 500, orderBy = 'Id') {
    //     let match = ''
    //     _.each(filters, filter => {
    //         if (index > 0) match += ' ' + operator + ' '
    //         match += `{${this.SoapName}:${filter.split(spliter)[0]}}:${filter.split(spliter)[1]}*`
    //         index++
    //     })
    //     let querySpec = smartstore.buildRangeAndMatchQuerySpec(searchedField, startRange, endRange, match, order, limit, orderBy)

    //     return new Promise((fulfilled, rejected) => { 
    //         smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
    //     })
    // }

    searchByRange(searchedField, startRange, endRange, order = 'ascending', limit = 500, orderBy = 'Id') {
        let querySpec = smartstore.buildRangeQuerySpec(searchedField, startRange, endRange, order, limit, orderBy)

        return new Promise((fulfilled, rejected) => { 
            smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
        })
    }

    searchRelatedLists(orderBy = 'Id', order = 'ascending', limit = 500, filters = '', operator = ' OR ') {
        let querySpec
        let match = ''
        let index = 0

        if (filters[1].split("-")[1] === ''){
            match = `{${this.SoapName}:${filters[0].split("-")[0]}}:${filters[0].split("-")[1]}*`

            querySpec = smartstore.buildMatchQuerySpec(null, match, order, limit, orderBy)
        } else {
            _.each(filters, filter => {
                if (index > 0) match += ' ' + operator + ' '
                match += `{${this.SoapName}:${filter.split("-")[0]}}:${filter.split("-")[1]}*`
                index++
            })

            querySpec = smartstore.buildMatchQuerySpec(null, match, order, limit, orderBy)
        }
        
        return new Promise((fulfilled, rejected) => { 
            smartstore.querySoup(false, this.SoapName, querySpec, fulfilled, rejected)
        })
    }

    getById(id) {
        let querySpec = smartstore.buildExactQuerySpec("Id", id, 1)

        return new Promise((fulfilled, rejected) => { 
            smartstore.querySoup(false, this.SoapName, querySpec, (res) => {
                if (res.totalEntries <= 0)
                    fulfilled(null)
                else
                    fulfilled(res.currentPageOrderedEntries[0])
            }, rejected)
        })
    }        

    save(object) {
        return new Promise((fulfilled, rejected) => {
            let functionError = (data) => {
                console.log(data);
                rejected();
            };
            
            smartstore.upsertSoupEntries(false, this.SoapName, [object], fulfilled, functionError);
        })
    }
}
