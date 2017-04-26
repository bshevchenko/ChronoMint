import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'
import router from './router'
import { store } from './redux/configureStore'
import { checkMetaMask, checkTestRPC } from './redux/network/networkAction'

class App {
  start () {
    store.dispatch(checkMetaMask())
    store.dispatch(checkTestRPC())
    injectTapEventPlugin()
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      window.location.protocol = 'https:'
      window.location.reload()
    }
    render(
      <MuiThemeProvider muiTheme={themeDefault}>
        {router}
      </MuiThemeProvider>,
      document.getElementById('react-root')
    )
  }
}

export default new App()
