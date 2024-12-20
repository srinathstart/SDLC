import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBURL } from './config.js';
import imageRoute from './routes/imageRoute.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import productRoute from './routes/productRoute.js'
import quoteRoute from './routes/quoteRoute.js'
import { initializeSocket } from "./socket/socket.js"; // Import socket setup
import { createServer } from "http";

const app = express();
const httpServer = createServer(app); // Create an HTTP server
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for form data

//
app.use('/image', imageRoute);
app.use('/user', userRoute);
app.use('/message', messageRoute);
app.use('/product', productRoute);
app.use('/quote', quoteRoute);
//

// MongoDB Connection
mongoose
  .connect(mongoDBURL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Initialize socket.io
const io = initializeSocket(httpServer); // Initialize socket.io with httpServer
export { io }; // Export io if needed elsewhere

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
