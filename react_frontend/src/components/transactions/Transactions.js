import React, {Fragment, useContext, useEffect} from 'react'
import TransactionItem from './TransactionItem'
import Spinner from '../layout/Spinner'
import TransactionContext from '../../context/transaction/transactionContext'


const Transactions = () => {
  const transactionContext = useContext(TransactionContext);

  const {filtered, getTransactions, transactions, loading, transactionsByMonth, month} = transactionContext;

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  if(month !== null && transactionsByMonth.length === 0 && !loading) {
    return <h4>There are no transactions to display...</h4>;
  }

  return (
    <Fragment>
      {month !== null && !loading ? (filtered !== null ? filtered.map(transaction => (<TransactionItem key={transaction.transactionId} transaction={transaction}/>)) : transactionsByMonth.map(transaction => (
        <TransactionItem key={transaction.transactionId} transaction={transaction}/>
      ))) : <Spinner />}
    </Fragment>
  )
}

export default Transactions