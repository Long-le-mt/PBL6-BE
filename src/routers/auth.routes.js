import express from 'express';
import { authController } from 'controllers';
import { ValidatorBody, ValidatorParams } from 'validations';
import AuthMiddleware from 'middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *              example: "doantanty92"
 *              description: The name of the user.
 *            email:
 *              type: string
 *              example: "doantanty92@gmail.com"
 *              description: The email of the user.
 *            password:
 *              type: string
 *              example: "123456"
 *              description: The password of the user.
 *     responses:
 *      200:
 *          description: The user was successfully created
 *      500:
 *          description: Some server error
 */

router.post('/register', ValidatorBody('register'), authController.register);

router.post('/login', ValidatorBody('login'), authController.login);

router.post(
  '/refresh-token',
  ValidatorBody('refreshToken'),
  authController.refreshToken
);

router.get(
  '/confirmEmail/:confirmToken',
  ValidatorParams('confirmToken'),
  authController.confirmEmail
);

router.get('/test', AuthMiddleware.isRequired, (req, res) => {
  res.json({ message: req.jwt });
});

export default router;
