import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Card, CardHeader, CardMedia, CardContent, IconButton,
    Chip, Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Rating
} from '@mui/material';
import Swal from 'sweetalert2';
import { blue } from '@mui/material/colors';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function ProfileProductCard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [allquotes, setAllQuotes] = useState([]);
    const [userid, setUserId] = useState('');

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

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/product/uploads/${userid}`);
                const data = await response.json();
                console.log(data);

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Expected an array, but received:', data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (userid) {
            fetchData();
            fetchQuoteData();
        }
    }, [userid]);

    const fetchQuoteData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/quote/user/${userid}`);
            const data = await response.json();
            console.log(data);

            if (data.existingQuotes && Array.isArray(data.existingQuotes) && data.existingQuotes.length > 0) {
                setAllQuotes(data.existingQuotes); // Store the quotes in state
            } else {
                setAllQuotes([]); // If no quotes, set an empty array
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };




    const deleteproduct = async (productid) => {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmation.isConfirmed) {
            const response = axios.delete(`http://localhost:5000/product/delete/${productid}`);
            const response1 = axios.delete(`http://localhost:5000/image/delete/${productid}`);
            const response2 = axios.delete(`http://localhost:5000/quote/deletebyproduct/${productid}`);
            console.log((await response).status)
            if ((await response).status === 200 && (await response1).status === 200 && (await response2).status === 200) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Product has been deleted.",
                    icon: "success"
                });
            }
            else {
                Swal.fire({
                    title: "error!",
                    text: "Product Deletion Unsuccesful",
                    icon: "error"
                });
            }
        }
    }

    const deletequote = async (id) => {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmation.isConfirmed) {
            const response = axios.delete(`http://localhost:5000/quote/deletebyid/${id}`);

            console.log((await response).status)
            if ((await response).status === 200) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Quote has been deleted.",
                    icon: "success"
                });
            }
            else if ((await response).status === 404) {
                Swal.fire({
                    title: "404!",
                    text: " Quote Not Found.",
                    icon: "error"
                });
            }
            else {
                Swal.fire({
                    title: "error!",
                    text: "Quote Deletion Unsuccesful",
                    icon: "error"
                });
            }
        }
    }


    const goto = (key) => {
        navigate(`/product/${key}`);
    }
    const gotopost = () => {
        navigate(`/uploadpost`);
    };



    return (
        <div className='Card d-flex justify-content-between mt-3'>
            <div>
                <Box sx={{ display: 'flex', gap: '16px', mb: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => { gotopost() }}
                        sx={{
                            height: '60px',
                            borderRadius: '30px',
                            background: 'linear-gradient(to right, #00BFFF, #4230D9, #ADD8E6)', // Dynamic hover effect
                            transition: '0.3s',
                            color: '#FFFFFF',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                background: 'linear-gradient(to right, #00BFFF, #4230D9, #ADD8E6)', // Dynamic hover effect
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow on hover
                            },
                        }}
                        fullWidth
                    >
                        <i className="bi bi-plus-circle fs-3"></i>
                        <span className="ms-3">ADD Post</span>
                    </Button>

                </Box>


                {products.length > 0 ? (
                    products.map((post) => (
                        <Card key={post.id} sx={{ maxWidth: 495, marginBottom: '20px' }}>
                            <CardHeader
                                action={
                                    <button className='btn btn-outline-danger' onClick={() => deleteproduct(post.id)}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                }
                                subheader={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', padding: "5px" }}>
                                        <Chip label={post.category} size="small" className='bg-primary text-white' />
                                    </Box>
                                }
                            />
                            <div>
                                {post.previmage && (
                                    <CardMedia
                                        onClick={() => goto(post.id)}
                                        component="img"
                                        height="194"
                                        image={`data:image/jpeg;base64,${post.previmage}`}
                                        alt="Post image"
                                        sx={{
                                            objectFit: 'fill',
                                            width: '100%',
                                            height: '400px',
                                        }}
                                    />
                                )}
                                <CardContent className='d-flex justify-content-between align-items-center'>
                                    <Box>
                                        <Typography variant="h6" component="h2" sx={{ color: 'text.primary', fontWeight: '800' }} onClick={() => goto(post.id)}>
                                            {post.productName}
                                        </Typography>
                                        <Typography variant="h5" component="h2" sx={{ color: 'text.primary', marginTop: '3px' }}>
                                            ₹{post.cost}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Typography variant="h6" component="p" sx={{ width: 495, marginBottom: '20px', color: 'text.secondary', textAlign: 'center', marginTop: '20px' }}>
                        No posts yet
                    </Typography>
                )}

            </div>

            <div style={{ width: '40%', position: 'static', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '20px', padding: '25px', height: 'fit-content' }}>
                <h5>Quotes  <i class="bi bi-tags-fill fs-4"></i></h5><hr className='mb-4'/>
                {allquotes.length > 0 ? (
                    <div>
                        {/* Render the quotes here */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>

                            <tbody>
                                {allquotes.map((quote) => (
                                    <tr key={quote._id} style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                        <td style={{ padding: '12px 15px' }}>
                                            <button
                                                onClick={() => goto(quote.productid)}
                                                style={{
                                                    backgroundColor: 'blue',
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>₹{quote.quoteprice}</td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <button
                                                className='btn btn-outline-danger'
                                                onClick={() => deletequote(quote._id)}
                                                style={{ padding: '5px 8px', fontSize: '16px', cursor: 'pointer' }}
                                            >
                                                <i className="bi bi-trash3" style={{ color: 'red' }}></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                ) : (
                    <p>You have not quoted any products yet.</p>
                )}
            </div>

        </div>
    );
}
