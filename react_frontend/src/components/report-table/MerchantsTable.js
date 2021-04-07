import React, {useMemo, useContext, useEffect, Fragment} from 'react'
import {useTable, useSortBy, useGlobalFilter, useFilters} from 'react-table'
import {COLUMNS} from './MerchantColumns'
import TransactionContext from '../../context/transaction/transactionContext'
import GlobalFilter from './GlobalFilter'
import ColumnFilter from './ColumnFilter'
import './table.css'

const MerchantsTable = () => {
  const transactionContext = useContext(TransactionContext);
  const {merchantsByMonth, getTransactionsByMonth, month, setViewport} = transactionContext;

  // used to reset map
  const viewport = {
    latitude: 37.8283459,
    longitude: -96.5794797,
    width: "100%",
    height: "80vh",
    zoom: 3
  }

  useEffect(()=> {
    getTransactionsByMonth(month);
    setViewport(viewport)
    const data = merchantsByMonth;
  }, []);

  const data = merchantsByMonth;
  const columns = useMemo(() => COLUMNS, [])

  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter
    }
  }, [])

  const tableInstance = useTable({
    columns: columns,
    data: data,
    defaultColumn
  },
  useFilters,
  useGlobalFilter,
  useSortBy)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter
  } = tableInstance

  const {globalFilter} = state

  return (
    <Fragment>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()}>
        <thead>
          {
            headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      {/* <i style={{float: "right"}}class="fas fa-search"></i> */}
                      <span>
                        {column.Header === 'Merchant' && column.isSorted ? (column.isSortedDesc ? <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-alpha-up-alt"></i></span> : <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-alpha-down"></i></span>) : ''}
                        {column.Header === 'Total Spent' && column.isSorted ? (column.isSortedDesc ? <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-amount-up"></i></span> : <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-amount-down-alt"></i></span>) : ''}
                        {column.Header === 'Number of Transactions' && column.isSorted ? (column.isSortedDesc ? <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-amount-up"></i></span> : <span> <i style={{fontFamily:"FontAwesome", color:"white"}} className="fas fa-sort-amount-down-alt"></i></span>) : ''}
                      </span>
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {
                    row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </Fragment>
  )
}

export default MerchantsTable