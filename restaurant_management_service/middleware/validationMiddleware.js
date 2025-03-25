const { body, validationResult } = require('express-validator');

// Middleware to validate restaurant registration data
exports.validateRestaurantRegistration = [
  body('OwnerName').notEmpty().withMessage('Owner name is required'),
  body('OwnerEmail').isEmail().withMessage('Invalid email address'),
  body('OwnerMobileNumber').isMobilePhone().withMessage('Invalid mobile number'),
  body('ManagerName').notEmpty().withMessage('Manager name is required'),
  body('ManagerMobileNumber').isMobilePhone().withMessage('Invalid mobile number'),
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('bankAccountDetails.accountHolderName')
    .notEmpty()
    .withMessage('Account holder name is required'),
  body('bankAccountDetails.accountNumber')
    .notEmpty()
    .withMessage('Account number is required'),
  body('bankAccountDetails.bankName')
    .notEmpty()
    .withMessage('Bank name is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];