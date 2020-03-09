import { handleActions } from 'redux-actions'

//获取大区和BU数据
export const getAreaAndBuOrganization = handleActions({
    'GET_SECOND_AND_THREE_ORG_TREE' (state, action) {
        return action.payload
    }
}, [])