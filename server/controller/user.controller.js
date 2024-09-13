const AuthService = require('../services/auth.service');
const UserServices = require('../services/user.service');
const EmailService = require('../services/email.service');

const UserController = {
  userRegistration: async function (req, res) {
    try {
      const isExists = await UserServices.getUserData({
        firstName: req.body.firstName,
      });
      if (!isExists) {
        const password = AuthService.generateRandomPassword();
        const hashedPassword = await AuthService.generateHashPassword(password);
        const formData = {
          email: req.body.email,
          password: hashedPassword,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: req.body.mobile,
          status: 'active',
        };
        const user = await UserServices.addUser(formData);
        if (user) {
          delete user.password;
          const subject = 'Acoount setup';
          const textPart = `Dear ${user.firstName}, don't worry we are here.`;
          const link = `${process.env.WEB_URL}/login`;
          const html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2>Welcome to Our Service!</h2>
                  <p>Thank you for registering with us. Below are your account details:</p>

                  <p>
                    <strong>Username:</strong> ${user.firstName}<br/>
                    <strong>Password:</strong> ${password}
                  </p>

                  <p>
                    You can use the above credentials to log in to your account. Please keep this information secure and do not share it with anyone.
                  </p>

                  <p>
                    <a 
                      href="${link}" 
                      style="
                        display: inline-block; 
                        padding: 10px 20px; 
                        color: #fff; 
                        background-color: #4CAF50; 
                        text-decoration: none; 
                        border-radius: 5px;
                      ">
                      Click here to login
                    </a>
                  </p>

                  <p>If you have any issues, please contact our support team.</p>

                  <p>Best Regards,<br/>The Team</p>
                </div>
          `;

          await EmailService.sendEmail(user.email, subject, textPart, html);
          return res.status(201).json({
            success: true,
            message:
              'Registration email sended sussefully, plase chcek your email',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'something went wrong, please try again',
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }
    } catch (e) {
      console.log('e', e);
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
  updateProfile: async function (req, res) {
    try {
      const formData = {};
      const { profile, bio } = req.body;
      if (profile) formData.profile = profile;
      if (bio) formData.bio = bio;
      const data = await UserServices.updateUser(
        { _id: req.sessionDetails._id },
        formData
      );
      if (data) {
        return res.status(201).json({
          success: true,
          message: 'User profile updated succesfully',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'something went wrong, please try again',
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
  login: async function (req, res) {
    try {
      const user = await UserServices.getUserData({
        firstName: req.body.username,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      const isMatched = await AuthService.verifyPassword(
        req.body.password,
        user.password
      );
      if (isMatched) {
        const token = AuthService.generateToken({ userId: user._id });

        delete user.password;
        return res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user, token },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Password not matched',
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
  getProfile: async function (req, res) {
    try {
      const profile = await UserServices.getUserData({
        _id: req.sessionDetails._id,
      });
      delete profile.password;
      return res.status(200).json({
        success: true,
        message: 'User profile',
        data: { profile },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
};

module.exports = UserController;
