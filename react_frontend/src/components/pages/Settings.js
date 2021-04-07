import React, {useEffect, useContext, Fragment} from 'react'
import CategoriesTable from '../settings/CategoriesTable'
import TransactionContext from '../../context/transaction/transactionContext'
import AuthContext from '../../context/auth/authContext'

const Settings = () => {
  const authContext = useContext(AuthContext)
  const transactionContext = useContext(TransactionContext);

  const {transactionsByMonth, display, modal, month, getTransactionsByMonth, setViewport} = transactionContext;

  // used to reset map
  const viewport = {
    latitude: 37.8283459,
    longitude: -96.5794797,
    width: "100%",
    height: "80vh",
    zoom: 3
  }

  useEffect(() => {
    authContext.loadUser()
    getTransactionsByMonth(month);
    setViewport(viewport)
    const data = transactionsByMonth;
    // eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      <div>
        <h1>Edit Categories</h1>
        <CategoriesTable/>
      </div>
      <div className="footer"></div>
    </Fragment>
  )
}

export default Settings