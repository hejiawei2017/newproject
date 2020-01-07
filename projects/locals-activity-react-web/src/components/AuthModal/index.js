import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import AuthModal from './AuthModal'
import * as cbs from './cbs'

function enhanceComponent (ComponentCtr) {
  class Enhance extends Component {
    constructor () {
      super()
      this.openAuthModal = this.openAuthModal.bind(this)
      this.onCloseModal = this.onCloseModal.bind(this)
      this.state = {
        visible: false
      }
    }
    onCloseModal () {
      this.setState({
        visible: false
      })
    }
    openAuthModal () {
      this.setState({
        visible: true
      })
    }
    render () {
      const { visible } = this.state
      const { onSuccess, onError } = this.props
      return (
        <ComponentCtr
          visible={visible}
          cbs={cbs}
          onCloseModal={this.onCloseModal}
          onSuccess={onSuccess}
          onError={onError}
        />
      )
    }
  }

  return Enhance
}

function createAuthBox (props) {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const Enhance = enhanceComponent(AuthModal)
    const methods = ref => {
      return {
        show () {
          return ref.openAuthModal()
        },
        close () {
          return ref.onCloseModal()
        },
        destroy () {
          ReactDOM.unmountComponentAtNode(div)
          document.body.removeChild(div)
        }
      }
    }
    ReactDOM.render(
      <Enhance
        // eslint-disable-next-line react/jsx-no-bind
        ref={c => {
          resolve(methods(c))
        }}
        {...props}
      />,
      div
    )
  })
}

let ins
const createAuthIns = async props => {
  ins = await createAuthBox(props)
  return ins
}

export default {
  async config (props) {
    const ins = await createAuthIns(props)
    return ins
  },
  show () {
    return ins && ins.show()
  },
  close () {
    return ins && ins.close()
  },
  destroy () {
    return ins && ins.destroy()
  }
}
