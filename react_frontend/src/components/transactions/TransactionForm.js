import React, {useState, useContext, useEffect} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'

const TransactionForm = () => {
  const transactionContext = useContext(TransactionContext);

  const {transactions, addTransaction, updateTransaction, clearCurrent, current, closeModal, modal, wizardClearStep, transaction, setTransaction, clearTransaction} = transactionContext;

  useEffect(() => {
    if(current !== null) {
      setTransaction(current);
    } else {
      clearTransaction();
    }
  }, []);

  const todaysDate = () => {
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    return date;
  }

  const {transactionDate, transactionAmount, merchantName, categoryName, memberName, accountName} = transaction;

  const merchants = transactions.map(transaction => transaction.merchantName);
  const categories = transactions.map(transaction => transaction.categoryName);
  const members = transactions.map(transaction => transaction.memberName);
  const accounts = transactions.map(transaction => transaction.accountName);

  // const formatNumber = (n) => {
  //   return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  // }

  // const onBlur = (e) => {
  //   let input_val = e.target.value;
  //   if(e.target.value.indexOf('.') >= 0) {
  //     let decimal_pos = input_val.indexOf('.');
  //     let left_side = input_val.substring(0, decimal_pos);
  //     let right_side = input_val.substring(decimal_pos);
  //     left_side = formatNumber(left_side);
  //     right_side = formatNumber(right_side);
  //     right_side += "00";
  //     right_side = right_side.substring(0, 2);
  //     input_val = `$${left_side}.${right_side}`;
  //   } else {
  //     input_val = formatNumber(input_val);
  //     input_val = "$" + input_val;
  //     input_val += ".00";
  //   }
  //   e.target.value = input_val;
  // }

  const onChange = (e) => {
    if(e.target.name === 'merchantName') {
      merchants.map(merchant => merchant.toLowerCase() === e.target.value.toLowerCase() ? e.target.value = merchant : e.target.value);
    }
    // if(e.target.name === 'transactionAmount') {
    //   let input_val = e.target.value;
    //   if (input_val.indexOf(".") >= 0) {
    //     let decimal_pos = input_val.indexOf('.');
    //     let left_side = input_val.substring(0, decimal_pos);
    //     let right_side = input_val.substring(decimal_pos);
    //     left_side = formatNumber(left_side);
    //     right_side = formatNumber(right_side);
    //     right_side = right_side.substring(0, 2);
    //     input_val = `$${left_side}.${right_side}`;
    //   } else {
    //     input_val = formatNumber(input_val);
    //     input_val = "$" + input_val;
    //   }
    //   e.target.value = input_val;
    // }
    if(e.target.name === 'categoryName') {
      categories.map(category => category.toLowerCase() === e.target.value.toLowerCase() ? e.target.value = category : e.target.value);
    }
    if(e.target.name === 'memberName') {
      members.map(member => member.toLowerCase() === e.target.value.toLowerCase() ? e.target.value = member : e.target.value);
    }
    if(e.target.name === 'accountName') {
      accounts.map(account => account.toLowerCase() === e.target.value.toLowerCase() ? e.target.value = account : e.target.value);
    }
    setTransaction({...transaction, [e.target.name]: e.target.value});
  }

  if(!modal) return null

  return (
      <form className="form">
        <h2 className="text-primary">{current ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <div className="inputs">
            <input 
              type="text"
              placeholder="Merchant"
              name="merchantName"
              value={merchantName}
              onChange={onChange}
              required
            />
        </div>
        <div className="inputs">
          <input
            type="text"
            placeholder="Amount"
            name="transactionAmount"
            step="0.01"
            min="0"
            value={transactionAmount}
            onChange={onChange}
            required
          />
        </div>
        <div className="inputs">
          <input 
            type="date"
            placeholder="Date"
            name="transactionDate"
            value={transactionDate.split('T')[0]}
            onChange={onChange}
            required
          />
        </div>
        <div className="inputs">
            <input 
              type="text"
              placeholder="User"
              name="memberName"
              value={memberName}
              onChange={onChange}
              required
            />
        </div>
        <div className="inputs">
            <input
              type="text"
              placeholder="Category"
              name="categoryName"
              value={categoryName}
              onChange={onChange}
              required
            />
        </div>
        <div className="inputs">
            <input 
              type="text"
              placeholder="Account"
              name="accountName"
              value={accountName}
              onChange={onChange}
              required
            />
        </div>
        {current && <div>
        </div>}
      </form>
  )
}

export default TransactionForm