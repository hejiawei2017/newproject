import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "AummerActivityData"*/'./index'),
    loading: LoadingComponent
})

export default class AummerActivityData extends React.Component {
    render () {
        return <LoadableComponent />
    }
}