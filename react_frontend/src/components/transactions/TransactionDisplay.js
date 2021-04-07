import React, {useContext} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'

const TransactionDisplay = () => {
  const transactionContext = useContext(TransactionContext);
  const {clearCurrent, openModal, show_map, showMap} = transactionContext;

  const onEdit = () => {
    clearCurrent();
    openModal();
  }

  const onHide = () => {
    show_map === true ? showMap(false) : showMap(true);
  }

  return (
    <div style={{textAlign: "center"}}>
      <input className="inputs btn btn-primary btn-block" type="button" value={"Add New"} onClick={onEdit}/>
      {window.screen.width <= 900 ? <input className="inputs btn btn-warning btn-block" type="button" value={show_map === true ? "Hide Map" : "Show Map"} onClick={onHide}/> : null}
    </div>
  )
}

export default TransactionDisplay