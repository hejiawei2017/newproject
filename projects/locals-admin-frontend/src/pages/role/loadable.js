import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Role"*/'./index'),
    loading: LoadingComponent
})

export default class Role extends React.Component {
    render () {
        return <LoadableComponent />
    }
}