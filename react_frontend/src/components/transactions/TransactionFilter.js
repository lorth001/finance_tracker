import React, {useContext, useRef, useEffect} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'

const TransactionFilter = () => {
  const transactionContext = useContext(TransactionContext);
  const text = useRef('');

  const {filterTransactions, clearFilter, filtered, filter} = transactionContext;

  useEffect(() => {
    if(filtered === null) {
      text.current.value = '';
    }
  })

  const onChange = (e) => {
    if(text.current.value !== '') {
      filterTransactions(e.target.value);
    } else {
      clearFilter();
    }
  }

  return (
    <form>
      <input ref={text} type="text" placeholder="Filter Transactions..." onChange={onChange} value={filtered !== null ? filter : ''}/> 
    </form>
  )
}

export default TransactionFilter