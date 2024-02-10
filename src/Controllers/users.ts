import { db } from '../db'

export async function createUser(login: string, password: string) {
    const queryText = 'INSERT INTO users (login, password,role) VALUES ($1, $2,$3) RETURNING id';
    const values = [login,password,"user"];

    try {
        const result = await db.one(queryText, values);
        return result.id;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
export async function getUserByUsername(login: string) {
    const queryText = 'SELECT * FROM users WHERE login = $1';
    const values = [login];

    try {
        const user = await db.oneOrNone(queryText, values);
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}