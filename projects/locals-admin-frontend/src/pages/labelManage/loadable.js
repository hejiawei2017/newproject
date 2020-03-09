import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ArticleLabel"*/'./index'),
    loading: LoadingComponent
})

export default class LabelManage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}