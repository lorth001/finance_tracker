import React, {Fragment, useContext} from 'react'
import { Line } from 'react-chartjs-2'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'

const ScatterChart = () => {
  const transactionContext = useContext(TransactionContext);
  const {transactionsByMonth, transactions} = transactionContext;

  const inputLabels = [];
  const inputData = [];
  const inputColors = [];
  const inputBorders = [];
  const toolTipData = [];

  if(transactionsByMonth !== null && transactions !== null) {
    transactionsByMonth.map(transaction => {
      inputLabels.push(transaction.transactionDate);
      inputData.push(transaction.transactionAmount);
      inputColors.push(hexToRgba(transaction.categoryColor, '0.4'));
      inputBorders.push(`#${transaction.categoryColor}`)
      toolTipData.push({
        merchant: transaction.merchantName,
        category: transaction.categoryName
      })
    })
  }

  const data = {
    labels: inputLabels,
    datasets: [
      {
        label: 'Transactions',
        data: inputData,
        fill: false,
        backgroundColor: inputColors,
        borderColor: inputBorders,
        pointHoverRadius: 12,
        pointRadius: 10,
        showLine: false
      },
    ],
  }
  
  const options = {
    tooltips: {
      callbacks: {
        title: function(tooltipItems) {
          let dollarAmount = `$${tooltipItems[0].yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
          return dollarAmount
        },
        label: function(tooltipItem) {
          let label = [`Date: ${new Date(tooltipItem.xLabel).toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'}).split(' ')[0]}`]
          label.push(`Category: ${toolTipData[tooltipItem['index']].category}`)
          label.push(`Merchant: ${toolTipData[tooltipItem['index']].merchant}`)
          return label;
        }
      },
      displayColors: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return '$' + value;
          }
        }
      }],
      xAxes: [{
        type: 'time',
          time: {
            unit: 'day'
          }
      }]
    }
  }

  return (
    <Fragment>
      <div className="chart">
        <h1 className='title'>Scatter Chart</h1>
        <Line data={data} options={options} />
      </div>
    </Fragment>
  )
}

export default ScatterChart