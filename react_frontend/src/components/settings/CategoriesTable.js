import React, {useState, useContext, useEffect, Fragment} from 'react'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'
import CategoryItem from './CategoryItem'
import Spinner from '../layout/Spinner'

const CategoriesTable = () => {
  const transactionContext = useContext(TransactionContext);
  const {categories, getTransactions, setCategory, openModal, getTransactionsByMonth, setCustomDateRange, getTransactionsByCustomDate, loading, month, date_start, date_end} = transactionContext;

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <table id="categories_table">
        <thead>
          <tr>
            <th colSpan="1">Category</th>
          </tr>
        </thead>
        <tbody>
          {categories && categories.map(category => {
            return (
              <CategoryItem key={category.categoryId} categoryItem={category}/>
            )
          })}
        </tbody>
      </table>
    </Fragment>
  )
}

export default CategoriesTable