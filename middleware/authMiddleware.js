const jwt = require('jsonwebtoken')
require('dotenv').config();


const SECRET_KEY = process.env.JWT_KEY;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if(!authHeader || !authHeader.startsWith("Bearer ") ){
    return res.status(401).json({message: "Header not found"})
  }
  const token = authHeader.split(" ")[1]

  try{
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next()
  }
  catch(err){
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Token is not valid" });
  }

}

module.exports = verifyToken