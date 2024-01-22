import { body } from "express-validator";

export const authValidators = {
  signup: [
    body("username")
      .isString()
      .withMessage("Name must be a string.")
      .custom((value) => {
        if (value === "") {
          throw new Error("Name cannot be empty");
        }
        return true;
      }),
    body("email")
      .isString()
      .withMessage("Email must be a string.")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email id"),

    body("password").custom((value, { req }) => {
      if (value.length < 8) {
        throw new Error("Password must be longer than 8 characters.");
      }
      const name = (req.body as { username: string }).username.toLowerCase();
      if (value.toLowerCase().includes(name)) {
        throw new Error("Password should be different from username.");
      }
      const checkCapitalLetter = /[A-Z]+/;
      const checkNumber = /[0-9]+/;
      const checkSpecialChar = /[*@!#%&()^~{}]+/;

      if (
        !checkCapitalLetter.test(value) ||
        !checkNumber.test(value) ||
        !checkSpecialChar.test(value)
      ) {
        throw new Error(
          "Password must contain at least one special character, one Capital letter, and one number."
        );
      }
      return true;
    }),
  ],
};
