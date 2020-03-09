import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewPositionSetting"*/'./index'),
    loading: LoadingComponent
})

export default class NewPositionSetting extends React.Component {
    render () {
        return <LoadableComponent />
    }
}