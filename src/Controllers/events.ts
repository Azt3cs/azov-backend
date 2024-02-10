import { db } from '../db'

export async function createEvent(name: string, description: string,time_spending:string,coordinates:string,status:boolean) {
    const queryText = 'INSERT INTO events (name,description,time_spending,coordinates,status ) VALUES ($1,$2,$3,$4,$5) RETURNING id';
    const values = [name,description,time_spending,coordinates,status];

    try {
        const result = await db.one(queryText, values);
        return result.id;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}