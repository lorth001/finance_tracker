import React, {useContext} from 'react'
import ReactDom from 'react-dom'
import Alerts from '../../components/layout/Alerts'
import TransactionContext from '../../context/transaction/transactionContext'
import TransactionWizard from './TransactionWizard'

const TransactionModal = () => {
  const transactionContext = useContext(TransactionContext);

  const {modal, closeModal, step, wizardNextStep, wizardPrevStep, wizardClearStep} = transactionContext;

  const onClick = () => {
    closeModal();
    wizardClearStep();
  }

  if(!modal) return null

  return ReactDom.createPortal(
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={onClick}><i className="fas fa-times"/></button>
          <Alerts/>
          <TransactionWizard/>
        </div>
      </div>,
    document.getElementById('portal')
  )
}

export default TransactionModal