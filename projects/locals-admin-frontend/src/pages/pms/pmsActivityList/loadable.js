
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PmsStoreActivity"*/'./index'),
    loading: LoadingComponent
})

export default class PmsStoreActivity extends React.Component {
    render () {
        return <LoadableComponent />
    }
}