const Users = require("../Models/Users.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_KEY;

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
};

const authorize = async (req, res) => {
  const { email, name } = req.body;
  try {
    let user = await Users.findOne({ email });

    if (!user) {
      user = await Users.create({ email, name }); 
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in auth:", err);
  }
};

module.exports = authorize;
