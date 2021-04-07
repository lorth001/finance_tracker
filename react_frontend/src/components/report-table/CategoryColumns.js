import ColumnFilter from './ColumnFilter'
import hexToRgba from 'hex-to-rgba'

const processAmountCell = (cell) => {
  if (cell.value < 0) {
    return <span>${(Math.round(-cell.value*100) / 100).toFixed(2)} <span className="fas fa-comment-dollar" className={"badge"} style={{marginLeft: "10px", backgroundColor:"#90ee90"}}>Credit</span></span>
  } else {
    return <span>${(Math.round(cell.value*100) / 100).toFixed(2)}</span>;
  }
}

const processCategoryCells = (cell) => {
  return <span className={"badge"} style={{backgroundColor:(hexToRgba(`#${cell.data[cell.row.index].categoryColor}`, '0.4'))}}>{cell.value}</span>
}

export const COLUMNS = [
  {
    Header: 'Category',
    accessor: 'categoryName',
    Cell: (cell) => processCategoryCells(cell),
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
    accessor: 'categoryCount',
    disableFilters: false
  }
]