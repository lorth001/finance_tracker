import React, {useState, useContext, useEffect} from 'react'
import AuthContext from '../../context/auth/authContext'
import AlertContext from '../../context/alert/alertContext'

export const Register = (props) => {
  const authContext = useContext(AuthContext)
  const alertContext = useContext(AlertContext)

  const {register, error, isAuthenticated, clearErrors} = authContext
  const {setAlert} = alertContext

  useEffect(() => {
    if(isAuthenticated) {
      props.history.push('/')
    } else if(error === 'User already exists') {
      setAlert(error, 'danger')
      clearErrors()
    }
  }, [isAuthenticated, error, props.history])

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    password2: ''
  })

  const {fullName, email, password, password2} = user

  const onChange = e => setUser({...user, [e.target.name]: e.target.value})
  const onSubmit = e => {
    e.preventDefault()
    if(fullName === '' || email === '' || password === '') {
      setAlert('Please enter all fields', 'danger')
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      register({
        fullName,
        email,
        password
      })
    }
  }

  return (
    <div className='form-container'>
      <h1>
        Account <span className="text-primary"></span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="fullName" value={fullName} onChange={onChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" name="password2" value={password2} onChange={onChange}/>
        </div>
        <input type="submit" value="Register" className="btn btn-primary btn-block"/>
      </form>
    </div>
  )
}

export default Register