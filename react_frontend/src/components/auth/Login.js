import React, {Fragment, useState, useContext, useEffect} from 'react'
import AuthContext from '../../context/auth/authContext'
import AlertContext from '../../context/alert/alertContext'

export const Login = (props) => {
  const authContext = useContext(AuthContext)
  const alertContext = useContext(AlertContext)

  const {login, error, isAuthenticated, clearErrors} = authContext
  const {setAlert} = alertContext

  useEffect(() => {
    if(isAuthenticated) {
      props.history.push('/')
    } else if(error === 'Invalid credentials') {
      setAlert(error, 'danger')
      clearErrors()
    }
  }, [isAuthenticated, error, props.history])

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const {name, password, email} = user

  const onChange = e => setUser({...user, [e.target.name]: e.target.value})

  const onSubmit = e => {
    if(email === '') {
      setAlert('Please enter email', 'danger')
    } else if(password === '') {
      setAlert('Please enter password', 'danger')
    } else {
      e.preventDefault()
      login({
        email,
        password
      })
    }
  }

  return (
    <Fragment>
      <div className='form-container'>
        <h1>
          Account <span className="text-primary">Login</span>
        </h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" name="email" value={email} onChange={onChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={onChange}/>
          </div>
          <input type="submit" value="Login" className="btn btn-primary btn-block"/>
        </form>
      </div>
      <div className="message">
        <span>Enter <strong>guest@financetracker.app</strong> for the email and <strong>guest</strong> for the password to proceed as a guest.<br></br><br></br><strong>NOTE</strong><br></br>The guest account contains sample data which can't be modified.  Changes with the guest account are reflected in the browser, but they won't persist to the data store.  To experience full CRUD functionality, please register and login.</span>
      </div>
    </Fragment>
  )
}

export default Login