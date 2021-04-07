import React, {useContext, useReducer} from 'react'
import axios from 'axios'
import TransactionContext from './transactionContext'
import transactionReducer from './transactionReducer'
import AuthContext from '../auth/authContext'
import {
  GET_TRANSACTIONS,
  GET_CATEGORIES,
  OPEN_MODAL,
  CLOSE_MODAL,
  WIZARD_NEXT_STEP,
  WIZARD_PREV_STEP,
  WIZARD_CLEAR_STEP,
  SET_TRANSACTION,
  CLEAR_TRANSACTION,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CATEGORY,
  UPDATE_TRANSACTION,
  FILTER_TRANSACTIONS,
  CLEAR_TRANSACTIONS,
  CLEAR_FILTER,
  TRANSACTION_ERROR,
  SET_LOCATION,
  SHOW_MAP,
  SET_GEOCODE,
  CLEAR_GEOCODE,
  SET_VIEWPORT,
  SET_LOADING,
  CLEAR_VIEWPORT,
  SET_MONTH,
  GET_TRANSACTIONS_BY_MONTH,
  GET_MERCHANTS_BY_MONTH,
  GET_CATEGORIES_BY_MONTH,
  SET_CUSTOM_DATE_RANGE,
  GET_TRANSACTIONS_BY_CUSTOM_DATE,
  GET_MERCHANTS_BY_CUSTOM_DATE,
  GET_CATEGORIES_BY_CUSTOM_DATE,
  SET_REPORT_TYPE,
  SET_CHART_TYPE
} from '../types'

const TransactionState = props => {
  const initialState = {
    transactions: null,
    categories: null,
    current: null,
    transaction: {
      transactionDate: '',
      transactionAmount: '',
      merchantName: '',
      categoryName: '',
      categoryColor: '',
      latitude: '',
      longitude: '',
      address: '',
      memberName: '',
      accountName: '',
      microUserId: 1
    },
    month: null,
    date_start: null,
    date_end: null,
    reportType: 'transactions',
    chartType: 'scatter',
    show_map: true,
    transactionsByMonth: null,
    merchantsByMonth: null,
    categoriesByMonth: null,
    modal: false,
    step: 1,
    filtered: null,
    filter: null,
    error: null,
    loading: true,
    location: null,
    geocode: null,
    viewport: {
      latitude: 37.8283459,
      longitude: -96.5794797,
      width: "100%",
      height: "80vh",
      zoom: 3
    }
  };

  const authContext = useContext(AuthContext);
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get Transactions
  const getTransactions = async () => {
    try {
      const month = `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(-2)}`
      const transactions = await axios.get('https://financetrackerapi.azure-api.net/api/v1/transactions');
      const merchantsByMonth = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/merchants?month=${month}`)
      const categories = await axios.get('https://financetrackerapi.azure-api.net/api/v1/categories')
      const categoriesByMonth = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/categories?month=${month}`)
      
      dispatch({
        type: GET_TRANSACTIONS,
        payload: transactions.data
      })
      dispatch({
        type: GET_MERCHANTS_BY_MONTH,
        payload: merchantsByMonth.data
      })
      dispatch({
        type: GET_CATEGORIES,
        payload: categories.data
      })
      dispatch({
        type: GET_CATEGORIES_BY_MONTH,
        payload: categoriesByMonth.data
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  // Add Transaction
  const addTransaction = async(transaction) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const res = await axios.post('https://financetrackerapi.azure-api.net/api/v1/transactions', transaction, config);
      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  // Delete Transaction
  const deleteTransaction = async(transaction) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.delete(`https://financetrackerapi.azure-api.net/api/v1/transactions/${transaction.transactionId}`, config);

      dispatch({
        type: DELETE_TRANSACTION,
        payload: transaction
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  // Update Transaction
  const updateTransaction = async(transaction) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.put(`https://financetrackerapi.azure-api.net/api/v1/transactions/${transaction.transactionId}`, transaction, config);
      console.log(res.data)
      if(res.data !== null) {
        transaction.categoryColor = res.data;
      }
      dispatch({
        type: UPDATE_TRANSACTION,
        payload: transaction
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  // Set Current Transaction
  const setCurrent = transaction => {
    dispatch({
      type: SET_CURRENT,
      payload: transaction
    })
  }

  // Clear Current Transaction
  const clearCurrent = () => {
    dispatch({
      type: CLEAR_CURRENT
    })
  }

  // Set Transaction
  const setTransaction = transaction => {
    dispatch({
      type: SET_TRANSACTION,
      payload: transaction
    })
  }

  // Clear Transaction
  const clearTransaction = () => {
    dispatch({
      type: CLEAR_TRANSACTION
    })
  }

  // Filter Transactions
  const filterTransactions = text => {
    dispatch({
      type: FILTER_TRANSACTIONS,
      payload: text
    })
  }

  // Clear Filter
  const clearFilter = () => {
    dispatch({
      type: CLEAR_FILTER
    })
  }

  // Show and Hide Map
  const showMap = condition => {
    dispatch({
      type: SHOW_MAP,
      payload: condition
    })
  }

  // Set Location
  const setLocation = location => {
    dispatch({
      type: SET_LOCATION,
      payload: location
    })
  }

  // Set Viewport
  const setViewport = viewport => {
    dispatch({
      type: SET_VIEWPORT,
      payload: viewport
    })
  }

  // Open Modal
  const openModal = () => {
    dispatch({
      type: OPEN_MODAL,
      payload: true
    })
  }

  // Close Modal
  const closeModal = () => {
    dispatch({
      type: CLOSE_MODAL,
      payload: false
    })
  }

  // Wizard Next Step
  const wizardNextStep = () => {
    dispatch({
      type: WIZARD_NEXT_STEP
    })
  }

  // Wizard Previous Step
  const wizardPrevStep = () => {
    dispatch({
      type: WIZARD_PREV_STEP
    })
  }

  // Wizard Clear Step
  const wizardClearStep = () => {
    dispatch({
      type: WIZARD_CLEAR_STEP
    })
  }

  // Set Geocode
  const setGeocode = geocode => {
    dispatch({
      type: SET_GEOCODE,
      payload: geocode
    })
  }

  // Clear Geocode
  const clearGeocode = () => {
    dispatch({
      type: CLEAR_GEOCODE
    })
  }

  // Clear Viewport
  const clearViewport = () => {
    dispatch({
      type: CLEAR_VIEWPORT
    })
  }

  // Set Month
  const setMonth = (month) => {
    dispatch({
      type: SET_MONTH,
      payload: month
    })
  }

  // Set Report Type
  const setReportType = (reportType) => {
    dispatch({
      type: SET_REPORT_TYPE,
      payload: reportType
    })
  }

  // Get Transactions By Month
  const getTransactionsByMonth = async(month) => {
    try {
      const transactions = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/transactions?month=${month}`);
      const merchants = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/merchants?month=${month}`);
      const categories = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/categories?month=${month}`);

      dispatch({
        type: GET_TRANSACTIONS_BY_MONTH,
        payload: transactions.data
      })
      dispatch({
        type: GET_MERCHANTS_BY_MONTH,
        payload: merchants.data
      })
      dispatch({
        type: GET_CATEGORIES_BY_MONTH,
        payload: categories.data
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  // Set Custom Date Range
  const setCustomDateRange = (date_start, date_end) => {
    dispatch({
      type: SET_CUSTOM_DATE_RANGE,
      payload: [date_start, date_end]
    })
  }

  // Get Transactions By Custom Date
  const getTransactionsByCustomDate = async(date_start, date_end) => {
    try {
      const transactions = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/transactions?start=${date_start}&end=${date_end}`);
      const merchants = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/merchants?start=${date_start}&end=${date_end}`);
      const categories = await axios.get(`https://financetrackerapi.azure-api.net/api/v1/categories?start=${date_start}&end=${date_end}`);

      dispatch({
        type: GET_TRANSACTIONS_BY_CUSTOM_DATE,
        payload: transactions.data
      })
      dispatch({
        type: GET_MERCHANTS_BY_CUSTOM_DATE,
        payload: merchants.data
      })
      dispatch({
        type: GET_CATEGORIES_BY_CUSTOM_DATE,
        payload: categories.data
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  const setLoading = (status) => {
    dispatch({
      type: SET_LOADING,
      payload: status
    })
  }

  const setChartType = (chartType) => {
    dispatch({
      type: SET_CHART_TYPE,
      payload: chartType
    })
  }

  const updateCategory = async(category) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const res = await axios.put(`https://financetrackerapi.azure-api.net/api/v1/categories/${category.categoryId}`, category, config);
      console.log(res)
      console.log(res.data)
      dispatch({
        type: UPDATE_CATEGORY,
        payload: category
      })
    } catch(err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.msg
      })
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        categories: state.categories,
        current: state.current,
        reportType: state.reportType,
        chartType: state.chartType,
        transaction: state.transaction,
        filtered: state.filtered,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        location: state.location,
        viewport: state.viewport,
        modal: state.modal,
        step: state.step,
        geocode: state.geocode,
        show_map: state.show_map,
        month: state.month,
        date_start: state.date_start,
        date_end: state.date_end,
        transactionsByMonth: state.transactionsByMonth,
        merchantsByMonth: state.merchantsByMonth,
        categoriesByMonth: state.categoriesByMonth,
        getTransactions,
        addTransaction,
        deleteTransaction,
        setCurrent,
        setReportType,
        setChartType,
        clearCurrent,
        setTransaction,
        clearTransaction,
        updateTransaction,
        filterTransactions,
        clearFilter,
        setLocation,
        setViewport,
        setLoading,
        openModal,
        closeModal,
        wizardNextStep,
        wizardPrevStep,
        wizardClearStep,
        setGeocode,
        showMap,
        clearGeocode,
        clearViewport,
        setMonth,
        getTransactionsByMonth,
        setCustomDateRange,
        getTransactionsByCustomDate,
        updateCategory
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;