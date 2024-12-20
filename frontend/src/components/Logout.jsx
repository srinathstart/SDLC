import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
  return (
    <div><button onClick={logout}>Logout</button></div>
  )
}

export default Logout;