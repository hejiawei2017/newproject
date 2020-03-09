import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import rootReducer from '../reducers'
import logger from '../middleware/logger'

// const history = createHistory()
// const middleware = routerMiddleware(history)

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose


const enhancer = composeEnhancers(
    //applyMiddleware(thunk, middleware),
    applyMiddleware(thunk, logger, promiseMiddleware),
)
let store = null

export default function configureStore (initialstate) {
    if(!store) {
        store = createStore(rootReducer, initialstate, enhancer)
    }
    return store
}