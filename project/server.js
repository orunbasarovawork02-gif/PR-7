const express = require("express");
const path = require("path");
const { ObjectId } = require("mongodb");
const db = require("./db");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (req, res) {
    try {
        const places = db.getCollection("places");
        const list = await places.find().sort({ name: 1 }).toArray();

        res.render("index", {
            title: "Тур-гид по Астане",
            heading: "Все места",
            places: list
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            title: "Ошибка",
            message: "Не удалось получить данные. Попробуйте позже."
        });
    }
});

app.get("/place/:id", async function (req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).render("404", {
            title: "Страница не найдена",
            message: "Такой достопримечательности нет."
        });
    }

    try {
        const places = db.getCollection("places");
        const place = await places.findOne({ _id: new ObjectId(req.params.id) });

        if (!place) {
            return res.status(404).render("404", {
                title: "Страница не найдена",
                message: "Такой достопримечательности нет."
            });
        }

        res.render("place", {
            title: place.name || "Достопримечательность",
            place: place
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            title: "Ошибка",
            message: "Не удалось получить данные. Попробуйте позже."
        });
    }
});

app.get("/add", function (req, res) {
    res.render("add", {
        title: "Добавить достопримечательность",
        error: null
    });
});

app.post("/add", async function (req, res) {
    try {
        const place = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            time: req.body.time || "",
            image: req.body.image
        };

        if (!place.name || !place.description || !place.address) {
            return res.render("add", {
                title: "Добавить достопримечательность",
                error: "Заполните название, описание и адрес"
            });
        }

        const places = db.getCollection("places");
        await places.insertOne(place);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            title: "Ошибка",
            message: "Не удалось сохранить данные. Попробуйте позже."
        });
    }
});

app.get("/about", function (req, res) {
    res.render("about", {
        title: "О проекте"
    });
});

app.use(function (req, res) {
    res.status(404).render("404", {
        title: "Страница не найдена",
        message: "Такой страницы нет."
    });
});

async function startServer() {
    try {
        await db.connect();
        app.listen(PORT, function () {
            console.log("Сайт запущен: http://localhost:" + PORT);
        });
    } catch (error) {
        console.error("Не удалось запустить сервер:", error.message);
        process.exit(1);
    }
}

startServer();
