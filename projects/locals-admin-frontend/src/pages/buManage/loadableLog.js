import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "BuLog"*/'./buLog.js'),
    loading: LoadingComponent
})

export default class BuLog extends React.Component {
    render () {
        return <LoadableComponent />
    }
}