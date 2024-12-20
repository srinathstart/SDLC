import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navba from '../components/Navba';

import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
const Profile = () => {
  const [userid, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rollno, setRollno] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Set the user ID from the token
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userid) {
      fetchUserData();
    }
  }, [userid]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${userid}`);
      console.log(res.data);
      setEmail(res.data.email);
      setRollno(res.data.rollno);
      setUsername(res.data.username);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='d-flex'>
      <Sidebar />
      <div className="container-fluid" style={{ marginLeft: '290px', paddingRight: '20px' }}>
        <div className='col-md-6 profile-section'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h1>Profile</h1>

            <Link to='/edit' className='btn btn-link'>
              <i className="bi bi-pen"></i> Edit Profile
            </Link>
          </div>
          <hr className="my-2" />
          <div className="mb-3 pt-3">
            <strong>Name: </strong>{username}
          </div>
          <div className="mb-3">
            <strong>Student ID: </strong>{rollno}
          </div>
          <div className="mb-3">
            <strong>Email: </strong>{email}
          </div>
        </div>


        <div className="col-md-6 quicklink-section">
          <h3 className='pb-2'>Quick Links</h3>
          <hr className="my-2" />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>My Posts</span>
            <Link to="/posts">
              <i className="bi bi-arrow-right-circle fs-4"></i>
            </Link>
          </div>
          <hr className="my-2" />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Chats</span>
            <Link to="/chat">
              <i className="bi bi-arrow-right-circle fs-4"></i>
            </Link>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Quotes</span>
            <Link to="/quotes">
              <i className="bi bi-arrow-right-circle fs-4"></i>
            </Link>
          </div>
        </div>



      </div>
    </div>
  )
}

export default Profile