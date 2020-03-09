import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "AlipayRemit"*/'./index'),
    loading: LoadingComponent
})

export default class AlipayRemit extends React.Component {
    render () {
        return <LoadableComponent />
    }
}