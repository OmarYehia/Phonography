const jwt = require("jsonwebtoken");
const { roles } = require("../User/roles/roles");
const User = require("../User/User");

const requireAuth = async (req, res, next) => {
  try {
    var token = req.headers.authentication.split(" ")[1];
  } catch (error) {
    res.status(401).json({ success: false, errors: { message: "Authentication header missing" } });
    return;
  }

  // Checking if token exists and verified
  if (token) {
    // Token verification
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        // Token is not valid
        res.status(401).json({ success: false, errors: { message: "unauthenticated" } });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ success: false, errors: { message: "unauthenticated" } });
  }
};

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.decodedToken.userId);
      const permission = roles.can(user.role)[action](resource);

      if (!permission.granted) {
        res.status(403).json({ success: false, errors: { message: "forbidden" } });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, errors: { message: err } });
    }
  };
};

module.exports = { requireAuth, grantAccess };
