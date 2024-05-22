const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        // Create new user
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        // Generate JWT
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('x-auth-token', token).send({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};
