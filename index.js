import ButtonOk from './src/components/button-ok'
import ButtonCancel from './src/components/button-cancel'
import ButtonAdd from './src/components/button-add'
import ButtonEdit from './src/components/button-edit'
import ButtonDelete from './src/components/button-delete'
import ButtonSearch from './src/components/button-search'
import ButtonSync from './src/components/button-sync'
import HeaderAdd from './src/components/header-add'
import HeaderChild from './src/components/header-child'
import HeaderDetail from './src/components/header-detail'
import HeaderMaster from './src/components/header-master'
import HeaderSave from './src/components/header-save'
import InputText from './src/components/input-text'
import InputTextArea from './src/components/input-text-area'
import InputNumber from './src/components/input-number'
//import InputDecimal from './src/components/input-decimal'
//import InputMask from './src/components/input-mask'
import InputDate from './src/components/input-date'
import InputImage from './src/components/input-image'
import InputSwitch from './src/components/input-switch'
import InputBoolean from './src/components/input-boolean'
import ListCommon from './src/components/list-common'
import ListCommonItem from './src/components/list-common-item'
import ListTile from './src/components/list-tile'
import ListTileItem from './src/components/list-tile-item'
import ModalAlert from './src/components/modal-alert'
import ModalError from './src/components/modal-error'
import ModalInformation from './src/components/modal-information'
import MenuSottelli from './src/containers/menu-sottelli'
import ProgressBar from './src/components/progress-bar'
import ModalLoading from './src/components/modal-loading'
import ModalQuestion from './src/components/modal-question'
import NotificationCommon from './src/components/notification-common'
import SelectOptions from './src/components/select-options'
import SelectMultipleOptions from './src/components/select-multiple-options'
import SharingOptions from './src/components/sharing-options'

import App, { RegisterSaga, RegisterAppNavigator, RegisterUserService, RegisterRecordTypeService,
    Theme, SetTheme }  from './src/application'
import { RegisterReducer } from './src/application/reducers'
import StandardService from './src/api-services/standard-service'
import * as Tracker from './src/containers/issue-tracker'
import { syncAllData, syncServicesData, addSyncService } from './src/api-services/root-sync-service'
import UserService from './src/api-services/user-service'
import RecordTypeService from './src/api-services/record-type-service'
import VersionService from './src/api-services/version-service'
import Splash from './src/containers/splash'
import Base from './src/containers/base'
import screenSynchronizationProgress from './src/containers/sync-sottelli'
import screenIncorrectVersion from './src/containers/version'
import { userLoading } from './src/application/user/user-saga'
import { SYNCHRONIZATION_LOADING } from './src/application/sync/sync-reducer'
import { setLastRouteName } from './src/application/navigator/navigator-reducer'

//Themes
import CasaDiConti from './src/themes/casa-di-conti'
import Valfilm from './src/themes/valfilm'
import BuschlerLepper from './src/themes/buschler-lepper'
import PremierPet from './src/themes/premier-pet'

export {
    Splash,
    Base,
    Theme,
    SetTheme,
    CasaDiConti,
    Valfilm,
    BuschlerLepper,
    PremierPet,
    screenSynchronizationProgress,
    screenIncorrectVersion,
    syncAllData,
    syncServicesData,
    userLoading,
    SYNCHRONIZATION_LOADING,
    addSyncService,
    App,
    StandardService,
    UserService,
    RecordTypeService,
    VersionService,
    ButtonOk,
    ButtonCancel,
    ButtonAdd,
    ButtonEdit,
    ButtonDelete,
    ButtonSearch,
    ButtonSync,
    HeaderAdd,
    HeaderChild,
    HeaderDetail,
    HeaderMaster,
    HeaderSave,
    InputText,
    InputTextArea,
    InputNumber,
    //InputDecimal,
    //InputMask,
    InputDate,
    InputImage,
    InputSwitch,
    InputBoolean,
    SelectOptions,
    SelectMultipleOptions,
    ListCommon,
    ListCommonItem,
    ListTile,
    ListTileItem,
    MenuSottelli,
    ModalAlert,
    ModalError,
    ModalInformation,
    ModalLoading,
    ModalQuestion,
    SharingOptions,
    NotificationCommon,
    ProgressBar,
    RegisterReducer, 
    RegisterSaga, 
    RegisterAppNavigator,
    RegisterUserService,
    RegisterRecordTypeService,
    setLastRouteName,
    Tracker
}