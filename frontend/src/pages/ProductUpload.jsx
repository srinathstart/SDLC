import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const ProductUpload = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [userid, setUserid] = useState('');
    const [productid, setProductid] = useState('');
    const [previmage, setPrevImage] = useState(null);
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserid(decodedToken.id);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    const handleFileChange = (e) => {
        const files = e.target.files;
        setImages([...files]);
    };

    const handleUploadImages = async (productid) => {
        if (images.length === 0) {
            Swal.fire({
                icon: 'information',
                title: 'Proceed...',
                text: 'No Images Selected ',
            });
              return;
            
        }

        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });
        formData.append('productid', productid);

        try {
            const res = await axios.post('http://localhost:5000/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status === 200) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 300,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Images Uploaded',
                });
            }
        } catch (err) {
            console.error('Error uploading images:', err);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
            Toast.fire({
                icon: 'error',
                title: 'Failed to upload images',
            });
        }
    };

    const handlePrevimage = (e) => {
        const image = e.target.files[0];
        if (image) {
            setPrevImage(image);
            const reader = new FileReader();
            reader.onload = (event) => {
                Swal.fire({
                    title: 'Your uploaded picture',
                    imageUrl: event.target.result,
                    imageAlt: 'The uploaded picture',
                });
            };
            reader.readAsDataURL(image);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productName', name);
        formData.append('description', description);
        formData.append('cost', cost);
        formData.append('userid', userid);
        if (previmage) {
            formData.append('previmage', previmage);
        }
        formData.append('category', category);

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Post it!',
            });

            if (result.isConfirmed) {
                const response = await axios.post('http://localhost:5000/product/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const temp = response.data.productid;
                setProductid(temp);
                
                if (temp) {
                    await handleUploadImages(temp);
                    await Swal.fire({
                        title: 'Posted!',
                        text: 'Your product has been uploaded.',
                        icon: 'success',
                    });
                    navigate('/myposts');
                } else {
                    console.error('Failed to set product ID');
                    axios.delete(`http://localhost:5000/product/delete/${temp}`);
                    console.error("Failed to set product ID");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        }
                      });
                      Toast.fire({
                        icon: "error",
                        title: "Failed to post"
                      });
                    return;
                }

               


            }
        } catch (error) {
            console.error(error);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
            Toast.fire({
                icon: 'error',
                title: 'Failed to upload product',
            });
        }
    };

    const handleCategory = (e) => {
        setCategory(e.target.value);
    };

    useEffect(() => {
        console.log('Product ID updated:', productid);
    }, [productid]);

    return (
        <div style={{ height: '100vh', overflowY: 'auto', overflow: 'hidden' }}>
            <div className="row" style={{ height: '100vh', overflowY: 'auto' }}>
                <div className="col-3">
                    <Sidebar />
                </div>
                <div className="col-7">
                    <div className="create-post-form p-3">
                        <div className="d-flex align-items-center p-3 my-3 mb-4 text-white bg-purple rounded shadow-sm">
                            <div className="lh-2">
                                <h1 className="h5 mb-0 text-dark lh-2"> Start Selling Today!</h1>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="d-flex ">
                                <div className="p-1 col-6 me-4">
                                    <label className="form-label">Product Name:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        // style={{ width: '200%' }}
                                        required

                                    />
                                </div>
                                <div className="p-1 col-3">
                                    <label className="form-label">Product Cost:</label>
                                    <input
                                        type="number"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <label className="form-label">Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="form-control"
                                style={{ height: '100px' }}
                            />

                            <div className="p-3">
                                <label className="form-label">Preview Image:</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handlePrevimage}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="p-3">
                                <label className="form-label">Product Image:</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="categorySelect" className="form-label">Select Category</label>
                                <select
                                    className="form-select"
                                    id="categorySelect"
                                    onChange={handleCategory}
                                    value={category}
                                >
                                    <option hidden>Open this select menu</option>
                                    <option value="Books & Study Materials">Books & Study Materials</option>
                                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                                    <option value="Furniture & Dorm Essentials">Furniture & Dorm Essentials</option>
                                    <option value="Clothing & Accessories">Clothing & Accessories</option>
                                    <option value="Sports & Fitness Equipment">Sports & Fitness Equipment</option>
                                    <option value="Stationery & Office Supplies">Stationery & Office Supplies</option>
                                    <option value="Musical Instruments & Hobbies">Musical Instruments & Hobbies</option>
                                    <option value="Games & Entertainment">Games & Entertainment</option>
                                    <option value="Miscellaneous & Others">Miscellaneous & Others</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-outline-primary">Create Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductUpload;
