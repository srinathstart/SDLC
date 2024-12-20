import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardMedia, CardContent, IconButton,
  Chip, Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Rating
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ProductCard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
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
  }, [userid]);

  const goto = (key) => {
    navigate(`/product/${key}`);
  };
  const gotopost = () => {
    navigate(`/uploadpost`);
  };

  useEffect(() => {
    fetch('http://localhost:5000/product/get/images')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const filteredProducts = products
    .filter((post) =>
      (post.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || post.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOrder === 'low-to-high') return a.cost - b.cost;
      if (sortOrder === 'high-to-low') return b.cost - a.cost;
      return 0;
    });

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


        {filteredProducts.length > 0 ? (
          filteredProducts.map((post) => (
            <Card key={post.id} sx={{ maxWidth: 495, marginBottom: '20px' }}>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', padding: "5px" }}>
                    <Chip label={post.category} size="small" className='bg-primary text-white' />
                  </Box>
                }
              />
              <div >
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
                <CardContent className='d-flex justify-content-between '>
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ color: 'text.primary', fontWeight: '800' }} onClick={() => goto(post.id)}>
                      {post.productName}
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ color: 'text.primary', marginTop: '3px' }}>
                      ₹{post.cost}
                    </Typography>

                  </Box>
                  {post.userid !== userid ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Link to={`/chat?userId=${post.userid}`}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: 'green',  // Set the background color to green
                            color: '#fff',             // Set text color to white
                            '&:hover': {
                              backgroundColor: 'darkgreen', // Darker green on hover
                            },
                          }}
                        >
                          Message Seller
                        </Button>
                      </Link>
                    </Box>
                  ) : null}

                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <Typography variant="h6" component="p" sx={{ width: 495, marginBottom: '20px', color: 'text.secondary', textAlign: 'center', marginTop: '20px' }}>
            No posts
          </Typography>
        )}
      </div>

      <div style={{ width: '40%', position: 'static', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '20px', padding: '25px', height: 'fit-content' }}>
        <div className=' fs-4 mb-3'><i class="bi bi-filter fs-4"></i>  <a>  Filters</a>
        </div>
        <Box sx={{ gap: '16px', mb: '20px' }}>
          {/* Search Input */}
          <TextField
            label="Search Products"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ gap: '16px', mb: '20px' }}>
          {/* Category Filter */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Books & Study Materials">Books & Study Materials</MenuItem>
              <MenuItem value="Electronics & Gadgets">Electronics & Gadgets</MenuItem>
              <MenuItem value="Furniture & Dorm Essentials">Furniture & Dorm Essentials</MenuItem>
              <MenuItem value="Clothing & Accessories">Clothing & Accessories</MenuItem>
              <MenuItem value="Sports & Fitness Equipment">Sports & Fitness Equipment</MenuItem>
              <MenuItem value="Musical Instruments & Hobbies">Musical Instruments & Hobbies</MenuItem>
              <MenuItem value="Games & Entertainment">Games & Entertainment</MenuItem>
              <MenuItem value="Miscellaneous & Others">Miscellaneous & Others</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ gap: '16px', mb: '20px' }}>
          {/* Sort Order */}
          <FormControl fullWidth>
            <InputLabel>Sort by Price</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort by Price"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="low-to-high">Low to High</MenuItem>
              <MenuItem value="high-to-low">High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}
