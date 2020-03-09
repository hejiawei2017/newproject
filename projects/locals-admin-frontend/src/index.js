import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes.js'
import './style/common.less'
import configureStore from './store/configureStore'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createHashHistory'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN'
moment.locale('zh-cn')


const history = createHistory()

const store = configureStore()

function loadScript (url, apikey) {
    var script = document.createElement("script")
    script.type = "text/javascript"
    script.src = url
    script.setAttribute("apikey", apikey)
    document.body.appendChild(script)
}

loadScript ("https://js.fundebug.cn/fundebug.1.7.3.min.js" , "e7155ef691fd2f8ee4cb6f54958593df361901c4a3aced0b7f0833e231505828")


class ErrorBoundary extends React.Component {
    constructor (props) {
        super (props)
        this.state = { hasError: false }
    }
    componentDidCatch (error, info) {
        this.setState ({ hasError: true })
        // 将component中的报错发送到Fundebug
        try {
            fundebug.notifyError (error, {// eslint-disable-line no-undef
                metaData: {
                    info: info
                }
            })
        } catch (error) {
        }
    }
    render () {
        if (this.state.hasError) {
            return null
            // 也可以在出错的component处展示出错信息
            // return <h1>出错了!</h1>;
        }
        return this.props.children
    }
}

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <ErrorBoundary>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <div>
                        <Routes />
                    </div>
                </ConnectedRouter>
            </Provider>
        </ErrorBoundary>
    </LocaleProvider>
    ,
    document.getElementById('app')
)
