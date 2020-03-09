import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "newOrganizationTree"*/'./index'),
    loading: LoadingComponent
})

export default class OrganizationTreeTo extends React.Component {
    render () {
        return <LoadableComponent />
    }
}