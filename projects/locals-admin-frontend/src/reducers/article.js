import { handleActions } from 'redux-actions'

export const articleTags = handleActions({
    'ARTICLE_GET_TAGS_SUCCESS' (state, action) {
        return {list:action.payload.list,loading: false}
    }
}, [])