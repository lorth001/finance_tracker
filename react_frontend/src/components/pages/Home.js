import React, {useContext, useEffect, Fragment} from 'react'
import TransactionModal from '../transactions/TransactionModal'
import Transactions from '../transactions/Transactions'
import TransactionDisplay from '../transactions/TransactionDisplay'
import TransactionMap from '../transactions/TransactionMap'
import TransactionFilter from '../transactions/TransactionFilter'
import TransactionContext from '../../context/transaction/transactionContext'
import SelectMonth from '../report-table/SelectMonth'
import AuthContext from '../../context/auth/authContext'

const Home = () => {
  const authContext = useContext(AuthContext)

  useEffect(() => {
    authContext.loadUser()
    // eslint-disable-next-line
  }, [])

  const transactionContext = useContext(TransactionContext)

  const {display, modal, show_map} = transactionContext;

  return (
    <Fragment>
      <div>
        <TransactionModal open={modal}/>
      </div>
      <div className="grid-3-2">
        <div>
          <TransactionDisplay/>
          {show_map === true ? <TransactionMap/> : null}
        </div>
        <div>
          <SelectMonth />
          <TransactionFilter/>
          <Transactions/>
        </div>
      </div>
      <div className="footer"></div>
    </Fragment>
  )
}

export default Home