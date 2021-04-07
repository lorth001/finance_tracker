import React, {Fragment, useContext} from 'react'
import {Polar} from 'react-chartjs-2'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'

const PolarChart = () => {
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
        label: 'Transactions By Category',
        data: inputData,
        backgroundColor: inputColors,
        borderColor: inputBorders,
        borderWidth: 1
      },
    ],
  }

  const options = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          let label = [`$${inputData[tooltipItem['index']].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`]
          label.push(`${toolTipData[tooltipItem['index']].category}`)
          label.push(`${((inputData[tooltipItem['index']] / inputData.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%`)
          return label;
        }
      },
      displayColors: false
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <Fragment>
      <div className='chart'>
        <h1 className='title'>Polar Area Chart</h1>
        <Polar data={data} options={options} />
      </div>
    </Fragment>
  )
}

export default PolarChart