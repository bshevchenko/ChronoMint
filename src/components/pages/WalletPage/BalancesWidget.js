import React, { Component } from 'react'
import { Paper, TextField, Divider } from 'material-ui'
import LS from '../../../dao/LocalStorageDAO'

import TIMEBalanceWidget from './BalancesWidget/TIMEBalanceWidget'
import LHTBalanceWidget from './BalancesWidget/LHTBalanceWidget'
import ETHBalanceWidget from './BalancesWidget/ETHBalanceWidget'

import globalStyles from '../../../styles'

const styles = {
  currencies: {
    marginTop: 24
  }
}

class BalancesWidget extends Component {
  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Balances</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}}/>

        <TextField
          floatingLabelText='Account'
          fullWidth
          value={LS.getAccount() || ''}
          disabled/>

        <div className='row' style={styles.currencies}>
          <div className='col-sm-4'>
            <ETHBalanceWidget />
          </div>
          <div className='col-sm-4'>
            <LHTBalanceWidget />
          </div>
          <div className='col-sm-4'>
            <TIMEBalanceWidget />
          </div>
        </div>
      </Paper>
    )
  }
}

export default BalancesWidget
