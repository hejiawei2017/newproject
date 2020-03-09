export default ({ dispatch, getState }) => next => action => {
    return next(action)
}