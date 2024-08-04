import env from 'dotenv'
env.config()
const URI: string = process.env.URI ?? ''
import mongoose from 'mongoose'

class Database {
    static instance: Database | null = null
    constructor() {
        this.connect()
    }

    connect(type: string = 'mongo'): void {
        mongoose.connect(URI, {

        }).then(() => {
            console.log("Connected to MongoDB successfully!")
        }).catch((error: Error) => {
            console.log("Error connecting to MongoDB: ", error)
        })
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB : Database = Database.getInstance()

export default instanceMongoDB