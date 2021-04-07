import React, {Fragment, useContext} from 'react'
import { Bar } from 'react-chartjs-2'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'

const BarChart = () => {
  const transactionContext = useContext(TransactionContext);
  const {transactionsByMonth, transactions} = transactionContext;

  const inputLabels = [];
  const inputData = [];
  const inputColors = [];
  const inputBorders = [];
  const toolTipData = [];

  if(transactionsByMonth !== null && transactions !== null) {
    transactionsByMonth.map(transaction => {
      if(inputLabels.includes(transaction.categoryName)) {
        inputData[inputLabels.indexOf(transaction.categoryName)] += transaction.transactionAmount
      } else {
        inputLabels.push(transaction.categoryName);
        inputData.push(transaction.transactionAmount);
        inputColors.push(hexToRgba(transaction.categoryColor, '0.4'));
        inputBorders.push(`#${transaction.categoryColor}`)
      }
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
        label: "Categories",
        data: inputData,
        borderWidth: 1,
        backgroundColor: inputColors,
        borderColor: inputBorders
      },
    ],
  }
  
  const options = {
    tooltips: {
      callbacks: {
        title: function() {},
        label: function(tooltipItem) {
          let label = [`$${tooltipItem.yLabel.toFixed(2)}`]
          label.push(tooltipItem.xLabel)
          label.push(`${((tooltipItem.yLabel / inputData.reduce((a, b) => a + b, 0))* 100).toFixed(2)}%`)
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
          },
          beginAtZero: true
        },
        stacked: true,
      }],
      xAxes: [{
        stacked: true
      }]
    }
  }

  return (
    <Fragment>
      <div className='chart'>
        <h1 className='title'>Bar Chart</h1>
        <Bar data={data} options={options} />
      </div>
    </Fragment>
  )
}

export default BarChart