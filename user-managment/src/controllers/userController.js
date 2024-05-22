const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};
