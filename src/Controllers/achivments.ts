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

