const router = require('express').Router();
const User = require('../models/user.model');

// @route   POST /auth/register
// @desc    Register a new user in our database after they are created in Firebase
router.post('/register', async (req, res) => {
    try {
        const { firebaseUid, email, firstName, lastName, mobileNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists.' });
        }

        const newUser = new User({
            firebaseUid,
            email,
            firstName,
            lastName,
            mobileNumber
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully', user: newUser });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
