import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ImMessage"*/'./index'),
    loading: LoadingComponent
})

export default class AssistantIM extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
