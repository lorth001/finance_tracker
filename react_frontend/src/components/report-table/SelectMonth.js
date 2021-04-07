import React, {useContext, useEffect, Fragment} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'
import Spinner from '../layout/Spinner'

const SelectMonth = () => {
  const transactionContext = useContext(TransactionContext);
  const {transactions, transactionsByMonth, getTransactions, setMonth, getTransactionsByMonth, setCustomDateRange, getTransactionsByCustomDate, loading, month, date_start, date_end} = transactionContext;

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const selectMonth = (e) => {
    setMonth(e.target.value)
    getTransactionsByMonth(e.target.value)
  }

  const customDateSelection = () => {
    let date_start = document.getElementById("date_start").value;
    let date_end = document.getElementById("date_end").value;

    if(date_start !== '' && date_end !== '') {
      setCustomDateRange(date_start, date_end)
      getTransactionsByCustomDate(date_start, date_end)
    }
  }

  const lookup = [];
  const months = [];

  if(transactions !== null) {
    transactions.map((transaction) => {
      const splitVal = transaction.transactionDate.split("-")
      const value = `${splitVal[0]}-${splitVal[1]}`
      const selection = new Date(transaction.transactionDate).toLocaleString('en-US', {month: 'long', year: 'numeric'})
      if(!lookup.includes(value)) {
        lookup.push(value)
        months.push({value, selection})
      }
    })
  }

  return (
    <Fragment>
      {transactions !== null && !loading ?
      <div>
        <form>
          <select id="months" name="months" onChange={selectMonth} value={month}>
            <option name="all" value="">All</option>
            <option name="custom" value="custom">Custom</option>
            {months.map(month => {
              return <option key={month.value} value={month.value}>{month.selection}</option>
            })}
          </select>
        </form>
        {month === 'custom' ?
        <form id="custom_months" >
          <input className="flex_45" 
            id="date_start"
            type="date"
            placeholder="Start date"
            name="date_start"
            onChange={customDateSelection}
          />
          <strong className="flex_10" style={{textAlign: 'center', fontSize: "1.4em"}}>to</strong>
          <input className="flex_45" 
            id="date_end"
            type="date"
            placeholder="End date"
            name="date_end"
            onChange={customDateSelection}
          />
        </form> : <span></span>}
      </div>
      : <Spinner/>}
    </Fragment>
  )
}

export default SelectMonth