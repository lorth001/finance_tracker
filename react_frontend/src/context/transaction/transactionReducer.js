import {
  GET_TRANSACTIONS,
  GET_CATEGORIES,
  OPEN_MODAL,
  CLOSE_MODAL,
  WIZARD_NEXT_STEP,
  WIZARD_PREV_STEP,
  WIZARD_CLEAR_STEP,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  SET_CURRENT,
  UPDATE_CATEGORY,
  CLEAR_CURRENT,
  SET_TRANSACTION,
  CLEAR_TRANSACTION,
  UPDATE_TRANSACTION,
  FILTER_TRANSACTIONS,
  CLEAR_TRANSACTIONS,
  CLEAR_FILTER,
  SHOW_MAP,
  TRANSACTION_ERROR,
  SET_LOCATION,
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
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal: true
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modal: false
      }
    case WIZARD_NEXT_STEP:
      return {
        ...state,
        step: state.step+=1
      }
    case WIZARD_PREV_STEP:
      return {
        ...state,
        step: state.step-1
      }
    case WIZARD_CLEAR_STEP:
      return {
        ...state,
        step: 1
      }
    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        transactionsByMonth: state.month === null ? action.payload.filter(transaction => {
          const splitVal = transaction.transactionDate.split("-")
          const value = `${splitVal[0]}-${splitVal[1]}`
          if(value === `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(-2)}`) {
            return transaction
          }
        }) : state.transactionsByMonth,
        month: state.month === null ? `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(-2)}` : state.month,
        loading: false
      }
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        transactionsByMonth: [action.payload, ...state.transactionsByMonth],
        loading: false
      };
    case UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction => transaction.transactionId === action.payload.transactionId ? action.payload : transaction),
        transactionsByMonth: state.transactionsByMonth.map(transaction => transaction.transactionId === action.payload.transactionId ? action.payload : transaction),
        loading: false
      }
    case DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction !== action.payload),
        transactionsByMonth: state.transactionsByMonth.filter(transaction => transaction !== action.payload),
        loading: false
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    case SET_TRANSACTION:
      return {
        ...state,
        transaction: action.payload
      }
    case CLEAR_TRANSACTION:
      return {
        ...state,
        transaction: {
          transactionDate: new Date().toISOString().split('T')[0],
          transactionAmount: '',
          merchantName: '',
          categoryName: '',
          latitude: '',
          longitude: '',
          address: '',
          memberName: '',
          accountName: '',
          microUserId: 1
        }
      }
    case FILTER_TRANSACTIONS:
      return {
        ...state,
        filtered: state.transactionsByMonth.filter(transaction => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return transaction.merchantName.match(regex) || transaction.transactionDate.match(regex) || transaction.address.match(regex) || transaction.transactionAmount.toString().match(regex);
        }),
        filter: state.filter = action.payload
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case TRANSACTION_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload
      }
    case SET_GEOCODE:
      return {
        ...state,
        geocode: action.payload
      }
    case SHOW_MAP:
      return {
        ...state,
        show_map: action.payload
      }
    case CLEAR_GEOCODE:
      return {
        ...state,
        geocode: null
      }
    case SET_VIEWPORT:
      return {
        ...state,
        viewport: (Array.isArray(action.payload) ? {
            ...state.viewport,
            latitude: action.payload[0],
            longitude: action.payload[1],
            transitionDuration: 250,
            width: "100%",
            height: "80vh",
            zoom: 6
          } : action.payload)
      }
    case CLEAR_VIEWPORT:
      return {
        ...state,
        viewport: null
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case SET_REPORT_TYPE:
      return {
        ...state,
        reportType: action.payload
      }
    case SET_CHART_TYPE:
      return {
        ...state,
        chartType: action.payload
      }
    case SET_MONTH:
      return {
        ...state,
        month: action.payload
      }
    case GET_TRANSACTIONS_BY_MONTH:
      return {
        ...state,
        transactionsByMonth: action.payload
      }
    case GET_MERCHANTS_BY_MONTH:
      return {
        ...state,
        merchantsByMonth: action.payload
      }
    case GET_CATEGORIES_BY_MONTH:
      return {
        ...state,
        categoriesByMonth: action.payload
      }
    case SET_CUSTOM_DATE_RANGE:
      return {
        ...state,
        date_start: action.payload[0],
        date_end: action.payload[1]
      }
    case GET_TRANSACTIONS_BY_CUSTOM_DATE:
      return {
        ...state,
        transactionsByMonth: action.payload
      }
    case GET_MERCHANTS_BY_CUSTOM_DATE:
      return {
        ...state,
        merchantsByMonth: action.payload
      }
    case UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction => transaction.transactionId === action.payload.transactionId ? action.payload : transaction),
        transactionsByMonth: state.transactionsByMonth.map(transaction => transaction.transactionId === action.payload.transactionId ? action.payload : transaction),
        loading: false
      }
    case UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category => category.categoryId === action.payload.categoryId ? action.payload : category)
      }
    case GET_CATEGORIES_BY_CUSTOM_DATE:
      return {
        ...state,
        categoriesByMonth: action.payload
      }
    default:
      return state;
  }
}