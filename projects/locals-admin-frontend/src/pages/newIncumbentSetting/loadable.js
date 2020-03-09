import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewIncumbentSetting"*/'./index'),
    loading: LoadingComponent
})

export default class NewIncumbentSetting extends React.Component {
    render () {
        return <LoadableComponent />
    }
}