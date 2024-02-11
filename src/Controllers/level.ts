import { db } from '../db'

export async function getAllLevel() {
    const queryText = 'SELECT * from levels'
    try{
        const result = await db.many(queryText);
        return result;
    }
    catch (e) {
        console.error(e)
        throw e;
    }
}