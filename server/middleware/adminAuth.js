const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const userMODEL = require("../model/userModel");

const userAuth = catchAsyncError(async (req, res, next) => {
  const { jwtoken } = req.cookies;

  if (!jwtoken) {
    return next(
      res.status(401).json({
        success: false,
        message: "Please Login to access this resource",
      })
    );
  }
  const decodedData = jwt.verify(jwtoken, process.env.JWT_SECRETCODE);
  req.user = await userMODEL.findById(decodedData.id);
  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          success: false,
          message: `Role: ${req.user.role} is not allowed to access this resource.`,
        })
      );
    }
    next();
  };
};

module.exports = { userAuth, authorizeRoles };
