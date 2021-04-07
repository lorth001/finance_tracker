import React, {useContext, Fragment} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'
import Spinner from '../layout/Spinner'

const SelectReportType = () => {
  const transactionContext = useContext(TransactionContext);
  const {setReportType, reportType, loading, transactions} = transactionContext;

  const selectReport = (e) => {
    //setLoading(true);
    setReportType(e.target.value)
  }

  return (
    <Fragment>
      {transactions !== null && !loading ?
      <div>
        <form>
          <select id="report-type" name="report-type" onChange={selectReport} value={reportType}>
            <option name="transactions" value="transactions">Transactions</option>
            <option name="categories" value="categories">Categories</option>
            <option name="merchants" value="merchants">Merchants</option>
          </select>
        </form>
      </div>
      : <Spinner/>}
    </Fragment>
  )
}

export default SelectReportType