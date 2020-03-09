import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "CommentList"*/'./index'),
    loading: LoadingComponent
})

export default class CommentList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}