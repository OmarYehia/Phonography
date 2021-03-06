const express = require("express");
const mongoose = require("mongoose");
const path = require('path')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const competitionRoutes = require("./src/routes/competitionRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/postRoutes");
const friendshipRoutes = require("./src/routes/friendshipRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const { requireAuth, grantAccess } = require("./src/middleware/authMiddleware");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static("uploads"));

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
app.use(categoryRoutes);
app.use(postRoutes);
app.use(friendshipRoutes);
app.use(likeRoutes);
app.use(commentRoutes);
