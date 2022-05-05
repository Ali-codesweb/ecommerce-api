const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authToken = req.headers.token;
  if (authToken) {
    const token = authToken.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {res.status(403).json({ message: "Token is not valid" }); return}
      req.user = user;
      
      next();
    });
  } else {
    return res.send(401).json({ message: "Not Authenticated" });
    return
  }
};

const verifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not allowed " });
    }
  });
};
const verifyTokenAndAdmin = (req, res, next) => {
  
  verifyToken(req, res, () => {
    console.log(req.user)
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not allowed " });
      return
    }
  });
};

module.exports = { verifyToken,verifyTokenAuthorization,verifyTokenAndAdmin };
