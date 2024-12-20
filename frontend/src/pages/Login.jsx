import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import styles from '../Main.module.css';
import Swal from 'sweetalert2';


const Login = () => {
    const [rollno, setRollno] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/user/login', { rollno: rollno.toLowerCase(), password });
            const { token } = res.data;
            localStorage.setItem('token', token);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
      
              Toast.fire({
                icon: "success",
                title: "Signed in successfully"
              });
            navigate('/')

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials!',
            });
            return;
        }
    };
    return (

        <div className={styles.registerContainer}>
            {/* Background circle animations */}
            <div className={`${styles.circle} ${styles.xxlarge} ${styles.shade1}`}></div>
            <div className={`${styles.circle} ${styles.xlarge} ${styles.shade2}`}></div>
            <div className={`${styles.circle} ${styles.large} ${styles.shade3}`}></div>
            <div className={`${styles.circle} ${styles.medium} ${styles.shade4}`}></div>
            <div className={`${styles.circle} ${styles.small} ${styles.shade5}`}></div>
            <div className="container col-xl-10 col-xxl-8 px-4 py-5">

                <div className="row align-items-center g-lg-5" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
                    <div className="col-lg-7 text-center text-lg-start">
                        <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Uni-Trade</h1>
                        <p className="col-lg-10 fs-5">
                            Connecting students through sustainable trading—your marketplace for pre-loved items.
                        </p>

                    </div>

                    <div className="col-md-10 mx-auto col-lg-5">
                        <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleLogin}>

                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Roll number"
                                    value={rollno}
                                    onChange={(e) => setRollno(e.target.value)}
                                    required
                                    name="rollno"
                                />
                                <label htmlFor="floatingInput">Student ID</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>

                            <button className="w-100 btn btn-lg btn-primary" type="submit">
                                Login
                            </button>
                            <hr className="my-4" />
                            <small>
                                Don't have an account?{' '}
                                <Link to='/register'>Register</Link>
                            </small>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login;