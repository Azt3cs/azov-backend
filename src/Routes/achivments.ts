import express, { Request, Response } from 'express';
import * as db from '../Controllers/achivments'
const router = express.Router();


/**
 * @swagger
 * /api/achivments/get:
 *   get:
 *     summary: Список достижений
 *     tags:
 *       - достижения
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






router.get('/achivments/get', async (req, res) => {
    try {
        const events = await db.getAchivments();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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