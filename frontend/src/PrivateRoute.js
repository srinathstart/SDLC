import { Navigate, Outlet } from 'react-router-dom';
import React from 'react'

const PrivateRoute = () => {
    const auth = { token: localStorage.getItem('token') };
  return (
    auth.token ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoute