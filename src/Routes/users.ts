import express, { Request, Response } from 'express';
import * as db from '../Controllers/users';
import * as crypto from 'crypto';
import jwt, { TokenExpiredError, verify } from 'jsonwebtoken';
const router = express.Router();
/**
 /**
 * @openapi
 * /api/login:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: login
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Пароль пользователя
 *     responses:
 *       '200':
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       '401':
 *         description: Неверное имя пользователя или пароль
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Регистрация
 *     tags:
 *       - Пользователи
 *     requestBody:
 *       description: JSON object containing user registration information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: The username for the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *             required:
 *               - login
 *               - password
 *     responses:
 *       '201':
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                   description: The unique identifier for the newly created user.
 *                 username:
 *                   type: string
 *                   description: The username of the newly created user.
 *                 token:
 *                   type: string
 *                   description: Authentication token for the newly registered user.
 *       '400':
 *         description: Bad Request. Missing required fields or user with the same username already exists.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server.
 */

/**
 * @openapi
 * /api/verify:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *
 *     responses:
 *       '200':
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       '401':
 *         description: Invalid token
 *       '500':
 *         description: Внутренняя ошибка сервера
 */


function generateSecretKey():string{
    const secretKey = crypto.randomBytes(64).toString('hex');
    return secretKey;
}
const secretkey = generateSecretKey()
console.log(secretkey);


router.get('/login', async (req: Request, res: Response) => {
    try {
        const { login, password } = req.query;

        const user = await db.getUserByUsername(login as string);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }

        const token = jwt.sign({ login }, secretkey, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/verify', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        console.log('Received Token:', token);

        if (!token) {
            return res.status(401).json({ error: 'Token is required' });
        }

        const decoded = jwt.verify(token as string, secretkey) as jwt.JwtPayload;
        console.log('Decoded Payload:', decoded);

        if (!decoded.login) { // Change this line from decoded.username to decoded.login
            return res.status(401).json({ error: 'Invalid token structure' });
        }

        const userInfo = await db.getUserByUsername(decoded.login);

        // Return user information in the response
        res.status(200).json({ userInfo });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});




router.post('/register', async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;

        if (!login || !password ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await db.getUserByUsername(login);

        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const userId = await db.createUser(login, password);

        // Generate a token for the newly registered user
        const token = jwt.sign({ login }, secretkey, { expiresIn: '1h' });

        res.status(201).json({  userId, login, password,token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







export default router;