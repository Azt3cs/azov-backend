import { db } from '../db'

export async function getAchivments() {
    const queryText = 'SELECT * from achivments'
    try{
        const result = db.many(queryText)
        return result
    }
    catch (e) {
        console.error(e)
        throw e;
    }
}

export async function getTotalEventsForUser(userId: number) {
    try {
        const result = await db.one('SELECT COUNT(*) AS total_events FROM event_history WHERE "user" = $1', userId);
        return result.total_events;
    } catch (error) {
        console.error('Ошибка при получении общего количества мероприятий пользователя:', error);
        throw error;
    }
}

export async function checkAndAwardAchievements(userId: number) {
    try {
        const totalEvents = await getTotalEventsForUser(userId);
        const achievements = await db.any('SELECT * FROM achivments');

        for (const achievement of achievements) {
            const { id, name } = achievement;

            // Проверяем, выполнены ли условия для начисления достижения
            if (totalEvents >= id*10) {
                // Проверяем, не получал ли пользователь это достижение ранее
                const receivedAchievement = await db.oneOrNone('SELECT * FROM received_achivments WHERE "user" = $1 AND achivment = $2', [userId, id]);

                if (!receivedAchievement) {
                    // Если достижение не получалось ранее, начисляем его пользователю
                    await db.none('INSERT INTO received_achivments("user", achivment) VALUES ($1, $2)', [userId, id]);
                    console.log(`Пользователь ${userId} получил достижение "${name}"`);
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при проверке и начислении достижений:', error);
        throw error;
    }
}
export async function getUserAchievements(userId: number) {
    try {
        // Получаем информацию о полученных достижениях пользователя
        const userAchievements = await db.any(
            'SELECT a.name FROM received_achivments ra JOIN achivments a ON ra.achivment = a.id WHERE ra."user" = $1',
            userId
        );

        return userAchievements.map((achievement: any) => achievement.name);
    } catch (error) {
        console.error('Ошибка при получении достижений пользователя:', error);
        throw error;
    }
}

