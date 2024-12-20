import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Button, Container, Row, Col, Carousel } from 'react-bootstrap';  // Importing necessary Bootstrap components
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const [images, setImages] = useState([]);
    const [product, setProduct] = useState({});
    const [quote, setQuote] = useState([]);
    const [quoteprice, setQuotePrice] = useState('');
    const [prevquoteprice, setPrevQuotePrice] = useState('');
    const [user, setUser] = useState({});
    const [myId, setMyId] = useState('');
    const { id } = useParams();
    console.log("Product ID:", id);

    // Get user ID from the token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setMyId(decodedToken.id);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    // Fetch product details
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/product/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.log("Error fetching product:", error);
        }
    };

    // Fetch user details of the seller
    const fetchUser = async () => {
        if (product.userid) {
            try {
                const response = await axios.get(`http://localhost:5000/user/${product.userid}`);
                setUser(response.data);
            } catch (error) {
                console.log("Error fetching user:", error);
            }
        }
    };

    // Fetch product images
    const fetchImages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/image/${id}`);
            setImages(response.data);
        } catch (error) {
            console.log("Error fetching images:", error);
        }
    };

    // Fetch the existing quote price
    const fetchQuote = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/quote/get/${id}`);
            setQuote(response.data);
        } catch (error) {
            console.log("Error fetching quote:", error);
        }
    };

    const fetchQuotePrice = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/quote/${id}?userid=${myId}`);
            setPrevQuotePrice(response.data.quoteprice);
        } catch (error) {
            console.log("Error fetching quote:", error);
        }
    };

    // Handle new or updated quote
    const handleQuotePrice = async (e) => {
        e.preventDefault();
        if (quoteprice === '') {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });

            Toast.fire({
                icon: "error",
                title: "Price Quoted is invalid"
            });
            return
        }
        try {
            await axios.post(`http://localhost:5000/quote/add/${id}?userid=${myId}`, { quoteprice });
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });

            Toast.fire({
                icon: "success",
                title: "Price Quoted"
            });
        } catch (error) {
            console.log("Error in handleQuote:", error);
        }
    };

    // Trigger the data fetching
    useEffect(() => {
        fetchProduct();
        fetchQuote();
        // fetch quotes initially
    }, [id]);

    useEffect(() => {
        if (product._id) {
            fetchUser();
            fetchQuotePrice();
            fetchImages();
        }
    }, [product]);

    return (
        < div className='d-flex'>
            <div style={{ width: '16%' }}><Sidebar /></div>
            <Container style={{ width: '80%' }}>
                <Row className="my-4">
                    <Col md={5}>
                        <h2>{product.productName}</h2>
                        <hr className="mt-4" />
                        <p>Product Details</p>
                        <hr />
                        <p><strong>Cost:</strong> ₹{product.cost}</p>
                        <p><strong>Description:</strong> {product.description}</p>

                        {product.userid !== myId ? (
                            <>
                                <hr className="mt-4" />
                                <p>Seller Details</p>
                                <hr />
                                <p><strong>Seller:</strong> {user.username || "N/A"}</p>
                                <p><strong>Seller-Email:</strong> {user.email || "N/A"}</p>
                                <hr />
                                <Button variant="primary" href={`/chat?userId=${user._id}`}>Message</Button>
                            </>
                        ) : null}
                    </Col>


                    <Col md={7}>
                        {/* Image Carousel */}
                        <Carousel>
                            {/* Always show the primary image */}
                            <Carousel.Item>
                                <img
                                    src={`data:image/jpeg;base64,${product.base64Image}`}
                                    alt="Primary Product Image"
                                    style={{ height: '500px', objectFit: 'fill' }}
                                />
                            </Carousel.Item>

                            {/* Display additional images */}
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            src={`data:image/jpeg;base64,${image.base64Image}`}
                                            alt={`Product image ${index + 1}`}
                                            style={{ height: '500px', objectFit: 'fill' }}
                                        />
                                    </Carousel.Item>
                                ))
                            ) : (
                                <Carousel.Item>
                                    <img
                                        src={`data:image/jpeg;base64,${product.base64Image}`}
                                        alt="No additional images"
                                        style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
                                    />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {/* Quote form for non-seller */}
                        {product.userid !== myId ? (
                            <form onSubmit={handleQuotePrice}>
                                <div>
                                    <p><strong>Interested in the product? Then quote your price!</strong><p>
                                        Your Previos Quote:₹{prevquoteprice}</p></p>
                                    <div className='d-flex col-md-6 align-items-center'>
                                        <input
                                            type="number"
                                            value={quoteprice}
                                            onChange={(e) => setQuotePrice(e.target.value)}
                                            placeholder={`Quote Your Price...`}
                                            className="form-control mb-3 me-2"  // Added margin-end for spacing between input and button
                                        />
                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="mb-3"  // To add margin-bottom for consistent spacing
                                            style={{ height: '38px' }}  // Adjust the button height to match the input
                                        >
                                            Quote Price
                                        </Button>
                                    </div>

                                </div>
                            </form>
                        ) : (
                            // Display quotes if the user is the seller
                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Quoted Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quote.length > 0 ? (
                                        quote.map((quoteItem) => (
                                            <tr key={quoteItem._id}>
                                                <td>{quoteItem.userid}</td>
                                                <td>{quoteItem.quoteprice}</td>
                                                <td>
                                                    <Link to={`/chat?userId=${quoteItem.userid}`} className="btn btn-link">Message Seller</Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No quotes available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default ProductDetails;
