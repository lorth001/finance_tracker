import React, {Fragment, useContext} from 'react'
import { Doughnut } from 'react-chartjs-2'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'
import { Tooltip } from 'chart.js'

const DoughnutChart = () => {
  const transactionContext = useContext(TransactionContext);
  const {transactionsByMonth, transactions} = transactionContext;

  const inputLabels = [];
  const inputData = [];
  const inputColors = [];
  const inputBorders = [];
  const toolTipData = [];

  function compare(a, b) {
    const amountA = a.transactionAmount;
    const amountB = b.transactionAmount;
  
    let comparison = 0;
    if (amountA > amountB) {
      comparison = 1;
    } else if (amountA < amountB) {
      comparison = -1;
    }
    return comparison;
  }

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
        category: transaction.categoryName,
      })
    })
  }

  const data = {
    //labels: inputLabels,
    datasets: [
      {
        label: 'Transactions By Category',
        data: inputData,
        backgroundColor: inputColors,
        borderColor: inputBorders,
        borderWidth: 1,
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
        <h1 className='title'>Doughnut Chart</h1>
        <Doughnut data={data} options={options} />
      </div>
    </Fragment>
  )
}

export default DoughnutChart