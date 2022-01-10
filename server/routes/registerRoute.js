const express = require("express");
const UserController = require("../controllers/userController.js");
const nodemailer = require("nodemailer");
const { userAuth, authorizeRoles } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/register", UserController.registration);
router.post("/login", UserController.LoginUser);
router.post("/password/forgot", UserController.forgotPass);
router.put("/password/reset/:token", UserController.resetPass);
router.get("/me", userAuth, UserController.getUserDetails);
router.put("/password/update", userAuth, UserController.changePass);
router.put("/me/update", userAuth, UserController.updateUserProfile);
router.get(
  "/admin/users",
  userAuth,
  authorizeRoles("admin"),
  UserController.getAllUsers
);
router.get(
  "/admin/user/:id",
  userAuth,
  authorizeRoles("admin"),
  UserController.getUserDetailAdmin
);
router.put(
  "/admin/user/:id",
  userAuth,
  authorizeRoles("admin"),
  UserController.updateUserRoleAdmin
);
router.delete(
  "/admin/user/:id",
  userAuth,
  authorizeRoles("admin"),
  UserController.deleteUserAdmin
);
router.get("/logout", UserController.Logout);

module.exports = router;
