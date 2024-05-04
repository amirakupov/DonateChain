const User = require('../models/User');

const getProfile = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Возвращаем имя пользователя и адрес электронной почты в качестве профиля пользователя
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
};
