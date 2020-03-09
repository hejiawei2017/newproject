import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ArticleAdd"*/'./index'),
    loading: LoadingComponent
})

export default class ArticleAdd extends React.Component {
    render () {
        return <LoadableComponent />
    }
}