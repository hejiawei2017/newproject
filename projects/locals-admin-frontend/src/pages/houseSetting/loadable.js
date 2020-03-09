import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseSettingList"*/'./index'),
    loading: LoadingComponent
})

export default class HouseSettingList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
