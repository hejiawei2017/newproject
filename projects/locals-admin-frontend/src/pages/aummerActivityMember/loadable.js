import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "AummerActivityMember"*/'./index'),
    loading: LoadingComponent
})

export default class AummerActivityMember extends React.Component {
    render () {
        return <LoadableComponent />
    }
}