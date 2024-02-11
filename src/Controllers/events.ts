import { db } from '../db'

export async function createEvent(name: string, description: string, time_spending: Date, coordinates: string, status: boolean, reward: number) {
    const values = [name, description, time_spending, coordinates, status, reward];

    const queryText = 'INSERT INTO public.events (name, description, time_spending, coordinates, status, reward) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';

    try {
        const result = await db.one(queryText, values);

        return result.id;
    } catch (error) {
        console.error('Ошибка при создании события:', error);
        throw error;
    }
}
export async function getEvent() {
   const queryText = 'SELECT * from events'
   try{
       const result = await db.many(queryText)
       return result
   } catch (e) {
       console.error(e)
       throw e;
   }
}


export async function registerEvent(eventId: number, userId: number) {
    const values = [eventId, userId];
    const queryText = 'INSERT INTO event_history (event, "user") VALUES ($1, $2)';
    try {
        await db.none(queryText, values);
        await db.none('UPDATE users SET expirience = expirience + 10 WHERE id = $1', userId);
    } catch (error) {
        console.error('Ошибка при регистрации пользователя на мероприятие:', error);
        throw error;
    }
}