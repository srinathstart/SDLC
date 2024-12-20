import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from '../Main.module.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [rollno, setRollno] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing on form submission

        // Basic validation
        if (password !== confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match!',
          });
          return;
        }

        if (!username || !email || !rollno || !password || !confirmPassword) {
            return alert('All fields are required');
        }

        const data = {
            username,
            email,
            rollno:rollno.toLowerCase(),
            password,
        };

        try {
            await axios.post('http://localhost:5000/user/register', data);
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
              title: "Registered successfully"
            });
            navigate('/login');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Please fill all required fields');
                } 
                else if (error.response.status === 401) {
                    
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Student ID already exists',
                    });
                } 
                else if (error.response.status === 402) {
                    
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'User mail already exists',
                    });
                } 
                else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: error.response.data,
                    });
                }
            } else {
                console.error(error);
                alert('Failed to connect to the server');
            }
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
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">
              Join Uni-Trade, Shop Smart!
            </h1>
            <p className="col-lg-10 fs-4">
              Join the Uni-Trade community and turn your unused items into opportunities! Register now to buy and sell with fellow students and make a difference on campus.
            </p>
          </div>
          <div className="col-md-10 mx-auto col-lg-5">
            <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleSignup}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  name="username"
                />
                <label>Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Student ID"
                  value={rollno}
                  onChange={(e) => setRollno(e.target.value)}
                  required
                  name="rollno"
                />
                <label>Student ID</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  name="email"
                />
                <label>Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  name="password"
                />
                <label>Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  name="cpassword"
                />
                <label>Confirm Password</label>
              </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
              <hr className="my-4" />
              <small>
                Have an Account? <Link to='/login'>Login</Link>
              </small>
            </form>
          </div>
        </div>
      </div>
    </div>
       
    );
};

export default Signup;
