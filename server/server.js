const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const competitionRoutes = require("./src/routes/competitionRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { requireAuth, grantAccess } = require("./src/middleware/authMiddleware");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//database conneciton
const port = process.env.PORT || 3001;
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
// This is just a test route to test access and auth
// https://soshace.com/implementing-role-based-access-control-in-a-node-js-application/ ---> for RBAC reference
app.get("/", requireAuth, grantAccess("updateAny", "member"), (req, res) => {
  res.send("API is working");
});
app.use(authRoutes);
app.use(competitionRoutes);
app.use(userRoutes);
