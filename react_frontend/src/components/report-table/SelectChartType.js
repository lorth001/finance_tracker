import React, {useContext, Fragment} from 'react'
import TransactionContext from '../../context/transaction/transactionContext'
import Spinner from '../layout/Spinner'

const SelectChartType = () => {
  const transactionContext = useContext(TransactionContext);
  const {setChartType, chartType, loading, transactions} = transactionContext;

  const selectChart = (e) => {
    setChartType(e.target.value)
  }

  return (
    <Fragment>
      {transactions !== null && !loading ?
      <div>
        <form>
          <select id="chart-type" name="chart-type" onChange={selectChart} value={chartType}>
            <option name="hide" value="hide">Hide</option>
            <option name="bar" value="bar">Bar Chart</option>
            <option name="doughnut" value="doughnut">Doughnut Chart</option>
            <option name="polar" value="polar">Polar Chart</option>
            <option name="scatter" value="scatter">Scatter Plot</option>
          </select>
        </form>
      </div>
      : <Spinner/>}
    </Fragment>
  )
}

export default SelectChartType