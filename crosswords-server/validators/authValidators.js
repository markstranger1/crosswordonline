import { body } from "express-validator";

const allowedCharacters = /^[A-Za-z0-9]+$/;

const userRegistrationValidation = [
  body("nickname")
    .exists({ checkFalsy: true })
    .withMessage("Nickname is required")
    .isLength({ min: 2 })
    .withMessage("Nickname must be at least 2 characters long")
    .matches(allowedCharacters)
    .withMessage(
      "Nickname can only contain letters and numbers (A-Z, a-z, 0-9)"
    )
    .trim()
    .escape(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(allowedCharacters)
    .withMessage(
      "Password can only contain letters and numbers (A-Z, a-z, 0-9)"
    )
    .trim()
    .escape(),
];

const userLoginValidation = [
  body("nickname")
    .exists({ checkFalsy: true })
    .withMessage("Nickname is required")
    .isLength({ min: 2 })
    .withMessage("Nickname must be at least 2 characters long")
    .matches(allowedCharacters)
    .withMessage(
      "Nickname can only contain letters and numbers (A-Z, a-z, 0-9)"
    )
    .trim()
    .escape(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(allowedCharacters)
    .withMessage(
      "Password can only contain letters and numbers (A-Z, a-z, 0-9)"
    )
    .trim()
    .escape(),
];

export { userRegistrationValidation, userLoginValidation };
