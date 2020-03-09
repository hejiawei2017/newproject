import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewResignationSetting"*/'./index'),
    loading: LoadingComponent
})

export default class NewResignationSetting extends React.Component {
    render () {
        return <LoadableComponent />
    }
}