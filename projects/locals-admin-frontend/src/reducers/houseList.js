import { handleActions } from 'redux-actions'

export const houseListM = handleActions({
    'GET_HOUSE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const imageListM = handleActions({
    'GET_IMAGE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const detailListM = handleActions({
    'GET_DETAIL_HOUSE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const detailDesigerM = handleActions({
    'GET_DETAIL_DESIGER_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const editAppM = handleActions({//增加评论
    'EDIT_APP_ING' (state, action) {
        return {loading: true}
    },
    'EDIT_APP_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})