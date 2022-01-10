const { ProductMODEL } = require("../model/productModel.js");

async function updateStock(id, quantity) {
  const product = await ProductMODEL.findById(id);

  if (product.Stock <= 0) {
    console.log("Order Out of Stock");
  } else {
    product.Stock -= quantity;
  }

  await product.save({ validateBeforeSave: false });
}

module.exports = updateStock;
