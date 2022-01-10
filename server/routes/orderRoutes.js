const express = require("express");
const OrderController = require("../controllers/orderController");
const { userAuth, authorizeRoles } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/order/new", userAuth, OrderController.createOrder);
router.get(
  "/order/:id",
  userAuth,
  authorizeRoles("admin"),
  OrderController.getSingleOrder
);
router.get("/orders/me", userAuth, OrderController.myOrders);
router.get(
  "/admin/orders",
  userAuth,
  authorizeRoles("admin"),
  OrderController.AllOrders
);
router.put(
  "/admin/order/:id",
  userAuth,
  authorizeRoles("admin"),
  OrderController.updateOrderStatus
);
router.delete(
  "/admin/order/:id",
  userAuth,
  authorizeRoles("admin"),
  OrderController.deleteOrder
);

module.exports = router;
