import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For Bootstrap Icons

const Navba = () => {
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();
    const handleLogout = () => {
        // Logic for logging out, like clearing token or user session
        localStorage.removeItem('token');
        navigate('/login');
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    return (
        <nav className="justify-content-between p-md-2 navbar navbar-expand-lg navbar-light bg-light">

            <div>
                <h3 className="poppins-light">
                    <Link to="/" className="text-primary" style={{ color: 'rgb(104,179,185)', textDecoration: 'none' }}>
                        Uni-Trade
                    </Link>
                </h3>
            </div>


            <div className='d-flex justify-content-around'>


                <div className="dropdown pe-5">
                    <button className="btn btn-link nav-link dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-person-circle fs-4"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-center" aria-labelledby="profileDropdown" style={{ alignItems: 'center' }}>
                        <li>
                            <Link className="dropdown-item" to={`/userprofile`}>
                                <i className="bi bi-pencil-square me-2"></i> Profile
                            </Link>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                            </button>
                        </li>
                    </ul>
                </div>


                <div className='ps-5 pe-5'>
                    <Link to="/chat" className="nav-link">
                        <i className="bi bi-chat-left-fill fs-4"></i>
                    </Link>
                </div>
            </div>




        </nav>
    );
};

export default Navba;
