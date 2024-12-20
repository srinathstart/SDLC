import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

//user login
router.post('/login', async (req, res) => {
    console.log(req.body);
    const { rollno, password } = req.body;

    if (!rollno || !password) {
        return res.status(400).json({ message: 'User ID and password are required' });
    }

    const user = await User.findOne({ rollno });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id}, 'whyDoUWant', { expiresIn: '1h' });
    res.json({ token });


});


//user register
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, rollno, email, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'User ID and password are required' });
    }

    const userrollnoExists = await User.findOne({ rollno });
    if (userrollnoExists) {
        return res.status(401).json({ message: 'User Roll No already exists' });
    }

    const usermailExists = await User.findOne({ email });
    if (usermailExists) {
        return res.status(402).json({ message: 'User mail already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, rollno, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


//user edit
router.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    console.log('User ID:', id);

    const { username, rollno, email, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if roll number already exists for another user
        const userrollnoExists = await User.findOne({ rollno, _id: { $ne: id } });
        if (userrollnoExists) {
            return res.status(401).json({ message: 'User Roll No already exists' });
        }

        // Check if email already exists for another user
        const usermailExists = await User.findOne({ email, _id: { $ne: id } });
        if (usermailExists) {
            return res.status(402).json({ message: 'User email already exists' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user fields
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, rollno, email, password: hashedPassword },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//get users
router.get('/users/:id', async (req, res) => {

    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "_id",
            "username",
            "rollno",
            "email",
        ]);
        return res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/:id', async (req, res) => {
    const id=req.params.id;
    try {
        const user = await User.findById(id).select([
            "_id",
            "username",
            "rollno",
            "email",
        ]);;
        return res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
})



export default router;