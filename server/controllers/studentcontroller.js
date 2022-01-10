const { ProductMODEL } = require("../model/productModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/features.js");

class StudentController {
  static createProduct = catchAsyncError(async (req, res) => {
    req.body.user = req.user.id;
    const create = await ProductMODEL.create(req.body);
    if (!create) {
      return res.status(400).json({
        success: false,
        message: "Couldn't created",
      });
    }
    res.status(201).json({
      success: true,
      create,
    });
  });

  static getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await ProductMODEL.countDocuments();
    const apiFeature = new ApiFeatures(ProductMODEL.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
      success: true,
      products,
      productCount,
    });
  });

  static getProductDetails = catchAsyncError(async (req, res, next) => {
    const ProductDetail = await ProductMODEL.findById(req.params.id);
    if (!ProductDetail) {
      return res.status(500).json({
        success: false,
        message: "Product no found",
      });
    } else
      res.status(200).json({
        success: true,
        ProductDetail,
      });
  });

  static updateProduct = catchAsyncError(async (req, res) => {
    let product = await ProductMODEL.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    } else product = await product.updateOne(req.body);
    res.status(200).json({
      success: true,
      product,
    });
  });

  static deleteProduct = catchAsyncError(async (req, res) => {
    const product = await ProductMODEL.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    } else await product.remove();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  });

  //create and update review
  static createProductReview = catchAsyncError(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await ProductMODEL.findById(productId);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }
    //reviewed comment updated
    const isreviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isreviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
    });
  });

  // get all reviews of a product
  static getProductReviews = catchAsyncError(async (req, res) => {
    const product = await ProductMODEL.findById(req.query.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

  //delete review
  static deleteReviews = catchAsyncError(async (req, res) => {
    const product = await ProductMODEL.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await ProductMODEL.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  });
}

module.exports = StudentController;
