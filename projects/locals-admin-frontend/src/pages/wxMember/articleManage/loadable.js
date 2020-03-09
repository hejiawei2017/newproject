import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const ArticleManageManage = Loadable({
    loader: () => import(/* webpackChunkName: "ArticleManageManage"*/'./index'),
    loading: LoadingComponent
})

export default class ArticleManage extends React.Component {
    render () {
        return <ArticleManageManage />
    }
}