import express, { Request, Response } from 'express';
import * as db from '../Controllers/level'
const router = express.Router();

/**
 * @swagger
 * /api/level/get:
 *   get:
 *     summary: Список уровней
 *     tags:
 *       - уровни
 *     responses:
 *       '200':
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of your apartment object here
 *       '500':
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


router.get('/level/get', async (req, res) => {
    try {
        const result = await db.getAllLevel();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router