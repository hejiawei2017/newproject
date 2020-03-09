import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ArticleList"*/'./index'),
    loading: LoadingComponent
})

export default class ArticleList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}