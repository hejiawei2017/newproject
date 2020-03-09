import React from 'react'
import { Breadcrumb, Layout } from 'antd'
const { Content } = Layout

class BreadcrumbCon extends React.Component {
    constructor () {
        super()
        this.state = {
        }
    }
    render () {
        const {pathName} = this.props
        return (
            <div>
                {<Breadcrumb style={{ margin: '16px 0 16px 16px' }}>
                    {pathName.split('-').map(i => <Breadcrumb.Item key={i}>{i}</Breadcrumb.Item>)}
                </Breadcrumb>}
                <Content className="page-content">
                    {this.props.children}
                </Content>
            </div>
        )
    }
}
export default BreadcrumbCon