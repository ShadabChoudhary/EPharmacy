const catchAsyncError = require("../middleware/catchAsyncError.js");
const userMODEL = require('../model/userModel.js')
const bcrypt = require("bcrypt");
const sendMails = require("../utils/sendEmail.js");
const crypto = require("crypto");

class UserController {
  static registration = catchAsyncError(async (req, res) => {
    const { name, email, password } = req.body;
    const hashPass = await bcrypt.hash(password, 10);

    const user = await userMODEL.create({
      name,
      email,
      password: hashPass,
      avatar: {
        public_id: "this is sample id",
        url: "sampleUrl",
      },
    });

    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      token,
    });
  });

  static LoginUser = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Email & Password",
      });
    }
    const user = await userMODEL.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const PasswordMatch = await bcrypt.compare(password, user.password);

    if (!PasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const token = user.getJWTToken();
    res.cookie("jwtoken", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  });

  static Logout = catchAsyncError(async (req, res) => {
    res.cookie("jwtoken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });

  static forgotPass = catchAsyncError(async (req, res) => {
    const user = await userMODEL.findOne({email:req.body.email})
    try {
      const mailreceive = await sendMails({
        email: req.body.email,
        subject: `ePharmacy Passord Recovery`,
      },req,res);

      if(!mailreceive){
        return res.status(400).json({
          success: false,
          message: 'Email not sent'
        })
      }else{
       return res.status(200).json({
        success: true,
        message: `Email send to ${user.email} successfully`,
      })
    }
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error,
      });
    }
  });

  //reset pass
  static resetPass = catchAsyncError(async (req, res) => {
    //creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userMODEL.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Reset Password Token is invalid or has been expired",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password doesn't match",
      });
    }

    const PasswordHash = await bcrypt.hash(req.body.password, 10);
    if (!PasswordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    user.password = PasswordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = user.getJWTToken();
    res.cookie("jwtoken", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  });

  //get User details(me)
  static getUserDetails = catchAsyncError(async (req, res) => {
    const user = await userMODEL.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  });

  //get ChangePass
  static changePass = catchAsyncError(async (req, res) => {
    const user = await userMODEL.findById(req.user.id).select("+password");

    const PasswordHash = await bcrypt.hash(req.body.newPassword, 10);

    if (!PasswordHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password doesn't match",
      });
    }

    const passwordCompare = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!passwordCompare) {
      return res.status(400).json({
        success: false,
        message: "old Password is incorrect",
      });
    }

    user.password = PasswordHash;

    await user.save();

    const token = user.getJWTToken();
    res.cookie("jwtoken", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  });

  // update user profile
  static updateUserProfile = catchAsyncError(async (req, res) => {
    const updateUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await userMODEL.findByIdAndUpdate(
      req.user.id,
      updateUserData,
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

  //get all users(Admin)
  static getAllUsers = catchAsyncError(async (req, res) => {
    const users = await userMODEL.find();

    res.status(200).json({
      success: true,
      users,
    });
  });

  //get user details (Admin)
  static getUserDetailAdmin = catchAsyncError(async (req, res) => {
    const user = await userMODEL.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User doesn't exist with this id: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  });

  //update user role(Admin)
  static updateUserRoleAdmin = catchAsyncError(async (req, res) => {
    const { name, email, role } = req.body;
    const updateUserData = {
      name,
      email,
      role,
    };

    const user = await userMODEL.findByIdAndUpdate(
      req.params.id,
      updateUserData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User doesn't exist with Id: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
    });
  });

  //delete user (Admin)
  static deleteUserAdmin = catchAsyncError(async (req, res) => {
    const user = await userMODEL.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User doesn't exist with Id: ${req.params.id}`,
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
    });
  });
}

module.exports = UserController;
