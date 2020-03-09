import React, { Component } from 'react'
import { Tabs, Layout } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'
import sessionstorage from 'sessionstorage'
const { Content } = Layout

const TabPane = Tabs.TabPane;

class TagsView extends Component {

    constructor (props) {
        super (props)
        this.state = {
            activeKey: '',
            panes: []
        }
    }
    componentDidMount () {
        let panesObj = sessionstorage.getItem('locals_admin_tags_list')
        let panes = panesObj !== null ? JSON.parse(panesObj).tagsList : []
        if(panes.length > 0){
            let flag = true
            panes.forEach(item => {
                if(item.key === this.props.match.path) {
                    flag = false
                }
            })
            if(flag) {
                panes.push({
                    key: this.props.match.path,
                    title: this.props.children.props.pathName
                })
            }
        }else{
            panes.push({
                key: this.props.match.path,
                title: this.props.children.props.pathName
            })
        }
        this.setState({
            activeKey: this.props.match.path,
            panes
        },() => {
            let obj = {
                tagsList: panes
            }
            sessionstorage.setItem('locals_admin_tags_list', JSON.stringify(obj))
        })
    }
    onChange = (activeKey) => {
        this.setState({ activeKey }, () => {
            this.props.history.push(activeKey)
        });
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey
        let lastIndex = -1
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key
        }
        this.setState({ panes, activeKey },() => {
            let obj = {
                tagsList: panes
            }
            sessionstorage.setItem('locals_admin_tags_list', JSON.stringify(obj))
        })
    }
    render () {

        return (
            <div>
                <Tabs
                    className="tags-view-container"
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                    hideAdd
                >
                    {this.state.panes.map(pane => {
                        return (
                            <TabPane
                             tab={pane.title}
                             key={pane.key}
                             closable={this.state.panes.length !== 1}
                            >

                            </TabPane>
                        )
                    })}
                </Tabs>
                <Content className="page-content">
                    {this.props.children}
                </Content>
            </div>
        )
    }
}
export default withRouter(TagsView)