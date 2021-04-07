import React, {useEffect, useContext} from 'react'
import TransactionsTable from '../report-table/TransactionsTable'
import CategoriesTable from '../report-table/CategoriesTable'
import MerchantsTable from '../report-table/MerchantsTable'
import SelectMonth from '../report-table/SelectMonth'
import SelectReportType from '../report-table/SelectReportType'
import SelectChartType from '../report-table/SelectChartType'
import TransactionContext from '../../context/transaction/transactionContext'
import ScatterChart from '../charts/ScatterChart'
import BarChart from '../charts/BarChart'
import DoughnutChart from '../charts/DoughnutChart'
import PolarChart from '../charts/PolarChart'
import AuthContext from '../../context/auth/authContext'

const DetailedReport = () => {
  const authContext = useContext(AuthContext)

  useEffect(() => {
    authContext.loadUser()
    // eslint-disable-next-line
  }, [])
  
  const transactionContext = useContext(TransactionContext);
  const {month, reportType, chartType} = transactionContext;

  const getChart = (type) => {
    if(chartType === 'hide') {
      return <span></span>
    }else if(chartType === 'bar') {
      return <BarChart/>
    } else if(chartType === 'doughnut') {
      return <DoughnutChart/>
    } else if(chartType === 'polar') {
      return <PolarChart/>
    } else if(chartType === 'scatter') {
      return <ScatterChart/>
    }
  }

  const getReport = (type) => {
    if(reportType === 'transactions') {
      return <TransactionsTable/>
    } else if(reportType === 'categories') {
      return <CategoriesTable/>
    } else if(reportType === 'merchants') {
      return <MerchantsTable/>
    }
  }

  return (
    <div className="grid-1">
      <div className="grid-3">
        <SelectMonth/>
        <SelectReportType/>
        <SelectChartType/>
      </div>
      <div>
        {month !== null ? getChart(chartType) : <p>Please select a month...</p>}
      </div>
      <div>
        {month !== null ? getReport(reportType) : <p>Please select a month...</p>}
      </div>
      <div className="footer"></div>
    </div>
  )
}

export default DetailedReport