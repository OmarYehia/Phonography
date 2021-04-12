const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // Handle app request
  const appHeader = req.headers["x-requested-with"];
  if (appHeader && appHeader === "app") {
    const appJWT = req.headers["x-access-token"];
    req.cookie("jwt", appJWT);
  }

  const token = req.cookies.jwt;

  // Checking if token exists and verified
  if (token) {
    // Token verification
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        // Token is not valid
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
