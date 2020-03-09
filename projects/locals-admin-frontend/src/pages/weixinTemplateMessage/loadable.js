import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WeixinTemplateMessage"*/'./index'),
    loading: LoadingComponent
})

export default class WeixinTemplateMessage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}