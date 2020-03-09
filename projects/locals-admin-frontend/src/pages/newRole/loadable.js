import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewRole"*/'./index'),
    loading: LoadingComponent
})

export default class NewRole extends React.Component {
    render () {
        return <LoadableComponent />
    }
}