import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseResourceJudge"*/'./index'),
    loading: LoadingComponent
})

export default class HouseResourceJudge extends React.Component {
    render () {
        return <LoadableComponent />
    }
}