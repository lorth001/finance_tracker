import ColumnFilter from './ColumnFilter'

const processAmountCell = (cell) => {
  if (cell.value < 0) {
    return <span>${(Math.round(-cell.value*100) / 100).toFixed(2)} <span className="fas fa-comment-dollar" className={"badge"} style={{marginLeft: "10px", backgroundColor:"#90ee90"}}>Credit</span></span>
  } else {
    return <span>${(Math.round(cell.value*100) / 100).toFixed(2)}</span>;
  }
}

export const COLUMNS = [
  {
    Header: 'Merchant',
    accessor: 'merchantName',
    disableFilters: false
  },
  {
    Header: 'Total Spent',
    accessor: 'sumTransactionAmount',
    Cell: (cell) => processAmountCell(cell),
    disableFilters: false
  },
  {
    Header: 'Number of Transactions',
    accessor: 'merchantCount',
    disableFilters: false
  }
]