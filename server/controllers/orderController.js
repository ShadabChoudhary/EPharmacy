const orderMODEL = require("../model/orderModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const { ProductMODEL } = require("../model/productModel");
const updateStock = require("../utils/orderUpdate.js");

class OrderController {
  //create new order
  static createOrder = catchAsyncError(async (req, res) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderMODEL.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  });

  //get single order(Admin)
  static getSingleOrder = catchAsyncError(async (req, res) => {
    const order = await orderMODEL
      .findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this Id",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  });

  //get my orders
  static myOrders = catchAsyncError(async (req, res) => {
    const orders = await orderMODEL.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  });

  //get All orders--Admin
  static AllOrders = catchAsyncError(async (req, res) => {
    const orders = await orderMODEL.find();

    //to get the total amount of an order
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount = Number(totalAmount) + Number(order.totalPrice);
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });

  //update order status--Admin
  static updateOrderStatus = catchAsyncError(async (req, res) => {
    const order = await orderMODEL.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this Id",
      });
    }
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: true,
        message: "You have delivered this order",
      });
    }

    //updating stocks quantity after order delivered
    order.orderItems.forEach(async (ord) => {
      await updateStock(ord.product, ord.quantity);
    });

    //messgae getting from frontend
    order.orderStatus = req.body.status;

    //sending order status
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  });

  //delete orders--Admin
  static deleteOrder = catchAsyncError(async (req, res) => {
    const order = await orderMODEL.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this Id",
      });
    }
    await order.remove();

    res.status(200).json({
      success: true,
      order,
    });
  });
}

module.exports = OrderController;
