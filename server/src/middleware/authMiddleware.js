const jwt = require("jsonwebtoken");
const { roles } = require("../User/roles/roles");
const User = require("../User/User");

const requireAuth = async (req, res, next) => {
  // Handle app request
  const appHeader = req.headers["x-requested-with"];
  if (appHeader && appHeader === "app") {
    const appJWT = req.headers["x-access-token"];
    req.cookies.jwt = appJWT;
  }

  const token = req.cookies.jwt;

  // Checking if token exists and verified
  if (token) {
    // Token verification
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        // Token is not valid
        res.status(401).json({ success: false, error: "unauthenticated" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ success: false, error: "unauthenticated" });
  }
};

const grantAccess = (action, resource) => {
  return (req, res, next) => {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        // Token is not valid
        res.status(401).json({ success: false, error: "unauthenticated" });
      } else {
        try {
          const user = await User.findById(decodedToken.id);

          const permission = roles.can(user.role)[action](resource);

          if (!permission.granted) {
            res.status(403).json({ success: false, error: "forbidden" });
          } else {
            next();
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ success: false, error: err });
        }
      }
    });
  };
};

module.exports = { requireAuth, grantAccess };
