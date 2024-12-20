import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggle button for mobile screens */}
            <button
                className="btn btn-primary d-lg-none"
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1050,
                }}
            >
                <i className="bi bi-list fs-6"></i>
            </button>

            {/* Sidebar */}
            <nav
                className={`d-flex flex-column align-items-center p-3 bg-light vh-100 ${isOpen ? 'd-block' : 'd-none d-lg-flex'}`}
                style={{ width: '250px', position: 'fixed', transition: 'transform 0.3s ease-in-out' }}
            >
                <div className='nav-link text-center p-md-3 w-100'>
                    <h3 className="poppins-light">
                        <Link to="/" className="text-primary" style={{ color: 'rgb(104,179,185)', textDecoration: 'none' }}>
                            Uni-Trade
                        </Link>
                    </h3>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <Link to="/" className="text-dark text-decoration-none">
                        <i className="bi bi-house-door fs-3"></i>
                        <span className="ms-3">Home</span>
                    </Link>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <Link to="/uploadpost" className="text-dark text-decoration-none">
                        <i className="bi bi-plus-circle fs-3"></i>
                        <span className="ms-3">Post</span>
                    </Link>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <Link to="/chat" className="text-dark text-decoration-none">
                        <i className="bi bi-chat-left fs-3"></i>
                        <span className="ms-3">Chat</span>
                    </Link>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <Link to="/myposts" className="text-dark text-decoration-none">
                        <i className="bi bi-grid-fill fs-3"></i>
                        <span className="ms-3">My Posts</span>
                    </Link>
                </div>

                

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <Link to="/userprofile" className="text-dark text-decoration-none">
                        <i className="bi bi-person-circle fs-3"></i>
                        <span className="ms-3">Profile</span>
                    </Link>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none" onClick={handleLogout} style={{ padding: 0, fontSize: '1.25rem' }}>
                        <i className="bi bi-box-arrow-right fs-3"></i>
                        <span className="ms-3">Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
