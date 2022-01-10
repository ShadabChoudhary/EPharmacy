const express = require("express");
const StudentController = require("../controllers/studentcontroller.js");
const { userAuth, authorizeRoles } = require("../middleware/adminAuth");

const router = express.Router();

router.get("/products", StudentController.getAllProducts);
router.post(
  "/admin/product/new",
  userAuth,
  authorizeRoles("admin"),
  StudentController.createProduct
);
router.put(
  "/admin/product/:id",
  userAuth,
  authorizeRoles("admin"),
  StudentController.updateProduct
);
router.delete(
  "/admin/product/:id",
  userAuth,
  authorizeRoles("admin"),
  StudentController.deleteProduct
);
router.get("/product/:id", StudentController.getProductDetails);
router.put("/review", userAuth, StudentController.createProductReview);
router.get("/reviews", StudentController.getProductReviews);
router.delete("/reviews", userAuth, StudentController.deleteReviews);

module.exports = router;
