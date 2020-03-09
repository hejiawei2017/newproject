import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "UserAdmin"*/'./index'),
    loading: LoadingComponent
})

export default class UserAdmin extends React.Component {
    render () {
        return <LoadableComponent />
    }
}