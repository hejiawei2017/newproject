import { handleActions } from 'redux-actions'

export const chatContent = handleActions({
    'CHAT_CONTENT' (state, action) {
        return {
            ...state,
            list: action.payload
        }
    }
}, [])
