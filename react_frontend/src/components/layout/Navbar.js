import React, {Fragment, useContext} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import AuthContext from '../../context/auth/authContext'
import TransactionContext from '../../context/transaction/transactionContext'

const Navbar = ({title, icon}) => {
  const authContext = useContext(AuthContext)
  const transactionContext = useContext(TransactionContext)

  const {show_map} = transactionContext
  const {isAuthenticated, logout, user} = authContext

  const onLogout = () => {
    logout()
  }

  const goHome = () => {
    show_map(true);
  }

  const dontGoHome = () => {
    show_map(false);
  }

  const authLinks = (
    <Fragment>
      <li>
        <Link to="/detailed-report">Report</Link>
      </li>
      <li>
        <Link to="/settings">Settings</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <a onClick={onLogout} href="/login">
          <span>Logout</span>
        </a>
      </li>
    </Fragment>
  )

  const guestLinks = (
    <Fragment>
      <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
    </Fragment>
  )

  return (
    <div className="navbar bg-primary">
      <h1>
        <Link to="/"><i className={icon}/> {title}</Link>
      </h1>
      <ul>
        {isAuthenticated ? authLinks : guestLinks}
      </ul>
    </div>
  )
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
}

Navbar.defaultProps = {
  title: 'Finance Tracker',
  icon: 'fas fa-credit-card'
}

export default Navbar