import { handleActions } from 'redux-actions'

export const commentListM = handleActions({
    'GET_COMMENT_TABLE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const delCommentM = handleActions({//刪除评论
    'DEL_COMMENT_ING' (state, action) {
        return {loading: true}
    },
    'DEL_COMMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const addCommentM = handleActions({//增加评论
    'ADD_COMMENT_ING' (state, action) {
        return {loading: true}
    },
    'ADD_COMMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const updateCommentM = handleActions({//更新评论
    'UPDATE_COMMENT_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_COMMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const onlyCommentM = handleActions({
    'GET_COMMENT_ONLY_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

