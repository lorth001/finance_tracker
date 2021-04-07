import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'
import { CLEAR_VIEWPORT } from '../../context/types';

const TransactionItem = ({transaction}) => {
  const transactionContext = useContext(TransactionContext);
  const {deleteTransaction, setCurrent, clearCurrent, setLocation, setViewport, clearViewport, openModal, setTransaction, show_map} = transactionContext;

  const {transactionId, transactionDate, transactionAmount, merchantName, categoryName, hexColor, memberName, latitude, longitude} = transaction;

  const onDelete = () => {
    transaction.active = 'N';
    deleteTransaction(transaction);
    clearCurrent();
  }

  const onEdit = () => {
    openModal();
    setCurrent(transaction);
  }

  const onMap = () => {
    setCurrent(transaction);
    setTransaction(transaction);
    setLocation(transaction);
    setViewport([latitude, longitude]);
  }

  const formatDate = (input) => {
    const date = new Date(input);
    return date.toLocaleString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        <span className="text-success">{"$" + transactionAmount}</span>
        <span>{" - " + merchantName}{' '}</span>
        <span style={{float: "right"}}>{formatDate(transactionDate)}</span>
      </h3>
      <ul className="list">
        <li>
          <i className="fas fa-user-circle"/> {memberName}
        </li>
        <li>
        <span style={{float: "right", backgroundColor: hexToRgba(transaction.categoryColor, '0.4')}} className={"badge"}>{categoryName}</span>
        </li>
        <li>
          <button className="btn btn-dark btn-sm" onClick={onEdit}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
          {show_map === true ?
          (transaction.longitude !== 0 ? <button className="btn btn-warning btn-sm" onClick={onMap}><i className="fas fa-map-marked"/></button> : null) :
          null }
        </li>
      </ul>
    </div>
  )
};

TransactionItem.propTypes = {
  transaction: PropTypes.object.isRequired
}

export default TransactionItem