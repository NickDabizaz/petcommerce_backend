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
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File size exceeds the limit (1 MB)" });
        }
        // Handle other Multer errors as needed
    } else {
        // Handle other types of errors
        next()
    }
});

router.get("/pic/:user_id", userController.getProfilpic);

// Logout process
router.post("/logout", userController.logout);

router.get("/:user_id", userController.getUser);

router.get("/", userController.getAllUser);

router.get("/store/:user_id", userController.getUserStore);

router.put("/:user_id", userController.updateUser)

module.exports = router;
