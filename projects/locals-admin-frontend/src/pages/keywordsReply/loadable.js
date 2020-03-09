import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "KeywordsReply"*/'./index'),
    loading: LoadingComponent
})

export default class KeywordsReply extends React.Component {
    render () {
        return <LoadableComponent />
    }
}