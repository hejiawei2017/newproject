import { createAction } from 'redux-actions'


export const getLabelListSuccess = createAction('GET_LABEL_LIST_SUCCESS')

export const getLabelDetailSuccess = createAction('GET_LABEL_DETAIL_SUCCESS')

export const updateLabel = createAction('UPDATE_LABEL_ING')
export const updateLabelSuccess = createAction('UPDATE_LABEL_SUCCESS')

export const addLabel = createAction('ADD_LABEL_ING')
export const addLabelSuccess = createAction('ADD_LABEL_SUCCESS')

export const actionLabel = createAction('ACTION_LABEL_ING')
export const actionLabelSuccess = createAction('ACTION_LABEL_SUCCESS')



