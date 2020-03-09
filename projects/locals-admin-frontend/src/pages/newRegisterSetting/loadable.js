import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewRegisterSetting"*/'./index'),
    loading: LoadingComponent
})

export default class NewRegisterSetting extends React.Component {
    render () {
        return <LoadableComponent />
    }
}