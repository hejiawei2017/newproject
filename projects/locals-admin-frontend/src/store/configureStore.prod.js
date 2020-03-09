import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import rootReducer from '../reducers'

const enhancer = compose(
    applyMiddleware(thunk, promiseMiddleware)
)

let store = null

export default function configureStore (initialstate) {
    if(!store) {
        store = createStore(rootReducer, initialstate, enhancer)
    }
    return store
}