import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent/index'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "SpiderTaskDeploy"*/'./index'),
    loading: LoadingComponent
})

export default class SpiderTaskDeploy extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
