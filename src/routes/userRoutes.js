const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../utils/multerConfig")

// Registration process
router.post("/register", userController.register);

// Login process
router.post("/login", userController.login);

//profil picture
router.post("/:type/:user_id", upload.single("file"), userController.profilpic);

router.get("/pic/:user_id", userController.getProfilpic);

// Logout process
router.post("/logout", userController.logout);

router.get("/:user_id", userController.getUser);

router.get("/", userController.getAllUser);

router.get("/store/:user_id", userController.getUserStore);

router.put("/:user_id", userController.updateUser)

module.exports = router;
