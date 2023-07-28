const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");

// @desc    Orders
// @route   POST /api/order
// @access  Public
const registerOrder = asyncHandler(async (req, res) => {
  const { datajson, active, canceled } = req.body;

  if (!datajson) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  //Create order
  const order = await Order.create({
    datajson,
    active,
    canceled,
  });

  if (order) {
    res.status(201).json({
      _id: order.id,
      datajson: order.datajson,
      active: order.active,
      canceled: order.canceled,
      token: generateToken(order._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

// @desc    Get order data
// @route   GET /api/order
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const { _id, datajson, active, canceled } = await Order.findById(
    req.order.id,
  );
  res.status(200).json({
    id: _id,
    datajson,
    active,
    canceled,
  });
});

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  registerOrder,
  getOrder,
};
