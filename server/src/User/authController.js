const User = require("./User");
const jwt = require("jsonwebtoken");

// Utils
const handleErrors = (err) => {
  let errors = {
    name: "",
    email: "",
    password: "",
    phone_number: "",
    country: "",
  };

  // Duplicate emails
  if (err.code === 11000) {
    errors["email"] = "This email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("incorrect password")) {
    errors["password"] = "Incorrect password";
    return errors;
  }

  if (err.message.includes("incorrect user")) {
    errors["email"] = "Incorrect user";
    return errors;
  }

  return errors;
};

const createToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.SECRET_TOKEN, {
    expiresIn: 24 * 60 * 60,
  });
};

const sendJWTCookie = (user, res) => {
  const token = createToken(user._id, user.isAdmin);
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};

module.exports.signup_get = (req, res) => {
  res.send("Fufu");
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password, phone_number, country } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      phone_number,
      country,
    });

    sendJWTCookie(user, res);

    // TODO to handle how mobile application will receive the token

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    sendJWTCookie(user, res);

    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
