const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function test() {
    if (!process.env.MONGODB_URI) {
        console.error("ошибка: не задана переменная MONGODB_URI. Проверьте файл .env");
        return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log("подключение работает");
    } catch (error) {
        console.error("ошибка:", error.message);
    } finally {
        await client.close();
    }
}

test();
