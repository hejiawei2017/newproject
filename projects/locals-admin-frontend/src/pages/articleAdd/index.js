import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import FormContent from './formContent'
import './index.less'

class ArticleAdd extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount () {
    }
    render () {
        return (
            <div className="article-add">
                <FormContent />
            </div>
        )
    }
}
export default withRouter(ArticleAdd)