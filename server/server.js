const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const { requireAuth } = require("./src/middleware/authMiddleware");
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
  })
  .then((result) => {
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", requireAuth, (req, res) => {
  res.send("API is working");
});
app.use(authRoutes);
