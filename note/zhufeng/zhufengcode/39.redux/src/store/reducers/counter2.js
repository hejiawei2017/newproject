import * as types from '../action-types';
let initState = { number: 0 }
export default function (state = initState, action) {
    switch (action.type) {
        case types.ADD:
            return { number: state.number + 1 };
        case types.MINUS:
            return { number: state.number - 1 };
        default:
            return state;
    }
}