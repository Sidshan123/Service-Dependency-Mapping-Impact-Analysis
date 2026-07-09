const express = require("express");

const router = express.Router();


const authenticate =
require("../middleware/auth.middleware");

const authController =
require("../controllers/auth.controller");

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    authController.login
);

router.delete(
    "/delete-account",
    authenticate,
    authController.deleteAccount
);



module.exports = router;