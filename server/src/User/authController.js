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

const createToken = (data) => {
  return jwt.sign(data, process.env.SECRET_TOKEN, {
    expiresIn: 24 * 60 * 60,
  });
};

const sendSuccessResponse = (res, code, data) => {
  const token = createToken({ userId: data.userId, role: data.role });
  res.status(code).json({
    success: true,
    data: { ...data, token },
  });
};

const sendFailureResponse = (res, code, errors) => {
  res.status(code).json({
    success: false,
    errors,
  });
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

    sendSuccessResponse(res, 201, { userId: user._id, role: user.role });
  } catch (err) {
    const errors = handleErrors(err);
    sendFailureResponse(res, 400, errors);
  }
};

module.exports.login_post = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    sendSuccessResponse(res, 200, { userId: user._id, role: user.role });
  } catch (err) {
    const errors = handleErrors(err);
    sendFailureResponse(res, 400, errors);
  }
};
