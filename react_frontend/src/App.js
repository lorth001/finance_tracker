import React, {Fragment} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './components/pages/Home'
import About from './components/pages/About'
import Settings from './components/pages/Settings'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alerts from './components/layout/Alerts'
import TransactionState from './context/transaction/TransactionState'
import AuthState from './context/auth/AuthState'
import AlertState from './context/alert/AlertState'
import DetailedReport from './components/pages/Detailed-Report'
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from './components/routing/PrivateRoute'
import './App.css'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  return (
    <AuthState>
      <TransactionState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar/>
              <div className="container">
                <Alerts/>
                <Switch>
                  <PrivateRoute exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/detailed-report" component={DetailedReport} />
                  <Route exact path="/settings" component={Settings} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </TransactionState>
    </AuthState>
  );
}

export default App;