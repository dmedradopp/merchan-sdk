import { call, put } from 'redux-saga/effects'
import { recordTypesLoadingStart, recordTypesLoadingFinish } from './record-type-reducer'
import { RecordTypeService } from '../../application'

export function* recordTypeLoading() {
    yield put(recordTypesLoadingStart())

    try {
        const recordTypes = yield call(
            RecordTypeService.searchAllFields,
            'Id',
            'ascending',
            500)

        yield put(recordTypesLoadingFinish(recordTypes))
    }catch(error) {
        console.log('Erro ao recuperar os tipos de registros: ' + error)
    }
}