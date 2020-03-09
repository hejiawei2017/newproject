import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "SignManager"*/'./save'),
    loading: LoadingComponent
})

export default class NotifySave extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
