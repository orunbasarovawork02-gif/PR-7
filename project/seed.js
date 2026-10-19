const fs = require("fs");
const path = require("path");
const db = require("./db");

async function seed() {
    await db.connect();

    const places = db.getCollection("places");
    const count = await places.countDocuments();

    if (count > 0) {
        console.log("коллекция places уже содержит данные:", count);
        process.exit(0);
    }

    const source = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data.json"), "utf8")
    );

    const documents = source.map(function (item) {
        return {
            name: item.title || item.name,
            description: item.description,
            address: item.address || item.category || "",
            category: item.category || "",
            time: item.time || "",
            image: item.image || ""
        };
    });

    if (documents.length === 0) {
        console.log("в data.json нет записей для переноса");
        process.exit(0);
    }

    await places.insertMany(documents);
    console.log("в облачную базу добавлено мест:", documents.length);
    process.exit(0);
}

seed().catch(function (error) {
    console.error("ошибка:", error.message);
    process.exit(1);
});
