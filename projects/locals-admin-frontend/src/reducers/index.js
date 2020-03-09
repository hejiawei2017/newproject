import { combineReducers } from 'redux'
import * as commentList from './commentList'
import * as houseList from './houseList'
import { routerReducer } from 'react-router-redux'
import * as authority from './authority'
import * as article from './article'
import * as role from './role'
import * as newRole from './newRole'
import * as userAdmin from './userAdmin'
import * as pushManage from './pushManage'
import order from './order'
import * as serviceProviderList from './serviceProviderList'
import * as serviceOrderManage from './serviceOrderManage'
import * as serviceItemManage from './serviceItemManage'
import * as serviceIncrementManage from './serviceIncrementManage'
import * as payBatch from './payBatch'
import * as weixinUserlist from './weixinUserlist'
import * as weixinTemplateList from './weixinTemplateList'
import * as keywordsReplylist from './keywordsReplylist'
import * as acounting from './acounting'
import * as weixinLabel from './weixinLabel'
import * as cityList from './cityList'
import * as houseChecking from './houseChecking'
import * as jurisdiction from './jurisdiction'
import * as promotion from './promotion'
import * as orderList from './orderList'
import * as organizations from './organizations'
import * as userInfo from './userInfo'
import * as IM from './IM'

const rootReducer = combineReducers({
    router: routerReducer,
    ...authority,
    ...commentList,
    ...houseList,
    ...authority,
    ...article,
    ...role,
    ...newRole,
    ...userAdmin,
    ...pushManage,
    ...orderList,
    order,
    ...serviceProviderList,
    ...serviceOrderManage,
    ...serviceItemManage,
    ...weixinTemplateList,
    ...serviceIncrementManage,
    ...payBatch,
    ...weixinUserlist,
    ...keywordsReplylist,
    ...serviceIncrementManage,
    ...acounting,
    ...weixinLabel,
    ...cityList,
    ...houseChecking,
    ...jurisdiction,
    ...promotion,
    ...organizations,
    ...userInfo,
    ...IM
})

export default rootReducer
