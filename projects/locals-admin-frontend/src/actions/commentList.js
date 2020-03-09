import { createAction } from 'redux-actions'

export const getCommentTableSuccess = createAction('GET_COMMENT_TABLE_SUCCESS')

export const getCommentOnlySuccess = createAction('GET_COMMENT_ONLY_SUCCESS')

export const delComment = createAction('DEL_COMMENT_ING')
export const delCommentSuccess = createAction('DEL_COMMENT_SUCCESS')

export const addComment = createAction('ADD_COMMENT_ING')
export const addCommentSuccess = createAction('ADD_COMMENT_SUCCESS')

export const updateComment = createAction('UPDATE_COMMENT_ING')
export const updateCommentSuccess = createAction('UPDATE_COMMENT_SUCCESS')
