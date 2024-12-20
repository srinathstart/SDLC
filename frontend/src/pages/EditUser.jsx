import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';
import { useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

const EditUser = () => {


    const [userid, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [rollno, setRollno] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            fetchUserData(); // Fetch user data when userid is set
        }
    }, [userid]); // This will run only when userid changes

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/${userid}`);
            console.log(res.data); // Check response
            setEmail(res.data.email || '');
            setRollno(res.data.rollno || '');
            setUsername(res.data.username || '');
        } catch (error) {
            console.error(error);
        }
    };

    const cancel = () => {
        navigate(`/userprofile`);
    };








    const handleEdit = async (e) => {
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
            rollno: rollno.toLowerCase(),
            password,
        };

        try {
            await axios.put(`http://localhost:5000/user/edit/${userid}`, data);
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
                title: "Update successfull"
              });
            navigate('/');
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
        <div>
            <Sidebar />
            <h2>Edit Profile</h2>
            <div className="col-md-10 mx-auto col-lg-5">
                <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleEdit}>
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
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Save</button>
                    <hr className="my-4" />
                    <button className="w-100 btn btn-lg justify-content-center btn-danger" type="submit" onClick={cancel}>Cancel</button>

                </form>
            </div>
        </div>

    )
}


export default EditUser;