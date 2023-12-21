const jwt = require("jsonwebtoken");
const models = require("../models");
const Joi = require("joi");
const { Store, User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = (user_id, user_email) => {
  return jwt.sign({ id: user_id, email: user_email }, "PETCOMMERCE", {
    expiresIn: "1d",
  });
};

const register = async (req, res) => {
  // Validate input
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    phone_number: Joi.string().required(),
    role: Joi.string().valid("customer", "seller").required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Get data from request
  const { name, email, password, address, phone_number, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const latestUser = await models.User.findOne({
      where: {
        deletedAt: null,
      },
      order: [["user_id", "DESC"]],
      attributes: ["user_id"],
    });

    let nextId = 1;

    if (latestUser) {
      nextId = latestUser.user_id + 1;
    }

    const token = generateToken(nextId, email);

    // Create new user with hashed password
    const user = await models.User.create({
      user_id: nextId,
      name,
      email,
      password: hashedPassword,
      address,
      phone_number,
      token: token,
      role,
    });

    // Return created user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};

const login = async (req, res) => {
  // Validate input
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await models.User.findOne({
      where: { email },
    });

    // If user exists
    if (user) {
      // Compare hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate and save token
        const token = generateToken(user.user_id, user.email);
        user.token = token;
        await user.save();

        // Return token, message, and role
        res.json({
          user_id: user.user_id,
          token,
          message: "Login successful",
          role: user.role,
        });
      } else {
        res.status(401).send("Invalid email or password");
      }
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};

const profilpic = async (req, res) => {
  return res.status(201).json({ msg: "profile picture berhasil di upload" });
};

const getProfilpic = (req, res) => {
  const user_id = req.params.user_id;
  const lokasinya = `uploads/profilpic/${user_id}.jpg`;
  // ./uploads/esther/profpic.jpg
  return res.status(200).sendFile(lokasinya, { root: "." });
};

const logout = async (req, res) => {
  // Validate input
  const schema = Joi.object({
    user_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { user_id } = req.body;

  try {
    // Find user by id
    const user = await models.User.findByPk(user_id);

    // If user exists
    if (user) {
      // Clear user token
      if (user.token) {
        user.token = null;
        await user.save();
      }

      // Return response
      res.send("Logged out successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging out");
  }
};

const getUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Mencari pengguna berdasarkan ID dalam token
    const user = await models.User.findOne({
      where: { user_id },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user");
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStore = async (req, res) => {
  try {
    const { user_id } = req.params;
    const store = await Store.findAll({ where: { user_id: user_id } });
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email, address, phone_number } = req.body;
    const user = await models.User.findOne({ where: { user_id: user_id } });
    const result = await user.update({
      name: name ? name : user.name,
      email: email ? email : user.email,
      address: address ? address : user.address,
      phone_number: phone_number ? phone_number : user.phone_number,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  getUserStore,
  updateUser,
  profilpic,
  getProfilpic,
  getAllUser,
};
