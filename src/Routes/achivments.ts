import express, { Request, Response } from 'express';
import * as db from '../Controllers/achivments'
const router = express.Router();


/**
 * @swagger
 * /api/achivments/get:
 *   get:
 *     summary: Список достижений
 *     tags:
 *       - Достижения
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

/**
 * @openapi
 * /api/achivments/userAchievements:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Достижения
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: Имя пользователя
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
 * @swagger
 * /api/achivments/checkAndAwardAchievements:
 *   post:
 *     summary: Запись на событие
 *     tags:
 *       - Достижения
 *     requestBody:
 *       description: Создает новую квартиру с предоставленными данными.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Квартира успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 message:
 *                   type: string
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




router.get('/achivments/get', async (req, res) => {
    try {
        const events = await db.getAchivments();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/achivments/checkAndAwardAchievements', async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        await db.checkAndAwardAchievements(userId);
        res.status(200).json({ message: 'Достижения успешно проверены и начислены' });
    } catch (error) {
        console.error('Ошибка при проверке и начислении достижений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
router.get('/achivments/userAchievements', async (req: Request, res: Response) => {
    const {userId} = req.query;

    try {

        const userAchievements = await db.getUserAchievements(Number(userId));
        res.status(200).json({ userAchievements });
    } catch (error) {
        console.error('Ошибка при получении достижений пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});



// router.delete('/apartments/delete', async (req:Request, res:Response) => {
//     try {
//         const { id } = req.query;
//         const idNumb = Number(id)
//         const feedbackId = await db.delAps(idNumb);
//         res.status(201).json({ id: feedbackId, message: 'Feedback created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//



export default router;