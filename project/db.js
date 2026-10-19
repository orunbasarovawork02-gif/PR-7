const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, ".env") });

if (!process.env.MONGODB_URI) {
    throw new Error("Не задана переменная MONGODB_URI. Проверьте файл .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
let database = null;

async function connect() {
    await client.connect();
    database = client.db("cinema");
    console.log("база подключена");
}

function getCollection(name) {
    if (!database) {
        throw new Error("База не подключена. Сначала вызовите connect().");
    }

    return database.collection(name);
}

module.exports = { connect, getCollection };
