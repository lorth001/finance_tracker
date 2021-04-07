import React, {useContext, Fragment} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'
import TransactionForm from './TransactionForm'
import TransactionGeocode from './TransactionGeocode'
import AlertContext from '../../context/alert/alertContext'

const TransactionWizard = () => {
  const transactionContext = useContext(TransactionContext);
  const alertContext = useContext(AlertContext)

  const {addTransaction, updateTransaction, clearCurrent, clearTransaction, clearGeocode, current, closeModal, step, wizardNextStep, wizardClearStep, transaction, geocode} = transactionContext;
  const {setAlert} = alertContext

  const Submit = (e) => {
    wizardClearStep();
    e.preventDefault();
    if(geocode && transaction.latitude !== geocode.latitude) {
      transaction.latitude = geocode.latitude;
      transaction.longitude = geocode.longitude;
      transaction.address = geocode.address;
    }
    if(transaction.merchantName === '') {
      setAlert('Please enter a merchant', 'danger')
    } else if(transaction.transactionAmount === '') {
      setAlert('Please enter an amount', 'danger')
    } else if(transaction.transactionDate === '') {
      setAlert('Please enter a date', 'danger')
    } else if (transaction.memberName === '') {
      setAlert('Please enter a user', 'danger')
    } else if(transaction.categoryName === '') {
      setAlert('Please enter a category', 'danger')
    } else if(transaction.accountName === '') {
      setAlert('Please enter an account', 'danger')
    } else if(transaction.address === '') {
      setAlert('Please enter an address', 'danger')
    } else if (current === null) {
          addTransaction(transaction);
          clearAll();
          closeModal();
    } else {
        updateTransaction(transaction);
        clearAll();
        closeModal();
    }
  }

  const clearAll = () => {
    clearCurrent();
    clearTransaction();
    clearGeocode();
  }

  if(window.screen.width <= 900) {
    switch(step) {
      case 2:
        return (
          <Fragment>
            <TransactionGeocode/>
            <div>
              <input className="inputs btn btn-primary btn-block" type="button" value={current ? 'Update Transaction' : 'Add Transaction'} onClick={Submit}/>
            </div>
          </Fragment>
        )
      default:
        return (
          <Fragment>
            <TransactionForm/>
            <div>
              <button className="inputs btn btn-light btn-block" onClick={clearAll}>Clear</button>  
              <input className="inputs btn btn-primary btn-block" type="button" value='Continue' onClick={wizardNextStep}/>
            </div>
          </Fragment>
        )
    }
  } else {
    return (
      <Fragment>
        <div className="grid-2">
          <TransactionForm/>
          <TransactionGeocode/>
      </div>
        <div>
          <button className="inputs btn btn-light btn-block" onClick={clearAll}>Clear</button>  
          <input className="inputs btn btn-primary btn-block" type="button" value={current ? 'Update Transaction' : 'Add Transaction'} onClick={Submit}/>
        </div>
      </Fragment>
    )
  }
}

export default TransactionWizard