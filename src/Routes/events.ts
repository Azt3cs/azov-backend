import express, { Request, Response } from 'express';
import * as db from '../Controllers/events'
const router = express.Router();
/**
 * @swagger
 * /api/event/create:
 *   post:
 *     summary: Создание события
 *     tags:
 *       - События
 *     requestBody:
 *       description: Создает новую квартиру с предоставленными данными.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               time_spending:
 *                 type: string
 *                 format: date
 *               coordinates:
 *                 type: string
 *               status:
 *                 type: boolean
 *               reward:
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

/**
 * @swagger
 * /api/event/registerEvent:
 *   post:
 *     summary: Запись на событие
 *     tags:
 *       - События
 *     requestBody:
 *       description: Создает новую квартиру с предоставленными данными.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: number
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



/**
 * @swagger
 * /api/event/get:
 *   get:
 *     summary: Список Событий
 *     tags:
 *       - События
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




router.post('/event/create', async (req: Request, res: Response) => {
    const { name, description, time_spending, coordinates, status, reward } = req.body;
    const url: string = "https://cleaner.dadata.ru/api/v1/clean/address";
    const token: string = "af76299f7dae225c05644106e2d432906ecf7ebe";
    const secret: string = "e013939c8df37e83df4be8cccbbcfe4932a31b83";
    const query: string = coordinates;

    const options: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token,
            "X-Secret": secret
        },
        body: JSON.stringify([query])
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const geoLat: number = result[0].geo_lat;
        const geoLon: number = result[0].geo_lon;

        const geo = `${geoLat} ${geoLon}`;

        const id = await db.createEvent(name, description, time_spending, geo, status, reward);
        res.status(201).json({ id, message: 'Event created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/event/get', async (req, res) => {
    try {
        const events = await db.getEvent();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/event/registerEvent', async (req: Request, res: Response) => {
    const { userId, eventId } = req.body;

    try {
        await db.registerEvent(eventId, userId);

        res.status(200).json({ message: 'Пользователь успешно зарегистрирован на мероприятие' });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя на мероприятие:', error);
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