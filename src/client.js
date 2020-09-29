// require("dotenv/config");
/**
 * Example Client Service
 *
 * This service should be considered a consumer of the main service.
 * We need to be able to integrate with many other teams and so need to ensure
 * our service can be used as seamlessly as possible by others.
 *
 * Here you should implement APIs that consume the APIs already created in our
 * main service. This can be either an express server or another Node.js
 * framework if you have experience with others.
 */

require('dotenv').config({ path: __dirname + '/../.env' })

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const got = require('got');
const mainServicePath = `http://localhost:${process.env.MAIN_SERVICE_PORT}`

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/migrate-users", async (_, res) => {
    try {
        await got(`${mainServicePath}/migrate-users`);
        res.send("rows have been updated!")
    } catch (error) {
        throw new Error('Could not migrate users.')
    }
})

app.get(`/users`, async (req, res) => {
    try {
        const perPage = Number(req.query.perPage) || 10
        const currentPage = Number(req.query.currentPage) || 1

        const response = await got(`${mainServicePath}/users`, { searchParams: { perPage, currentPage } });
        res.send(response.body)
    } catch (error) {
        throw new Error('Could not get users.')
    }
});

app.get(`/fullnames`, async (req, res) => {
    try {
        const perPage = Number(req.query.perPage) || 10
        const currentPage = Number(req.query.currentPage) || 1

        const response = await got(`${mainServicePath}/fullnames`,{ searchParams: { perPage, currentPage } });
        res.send(response.body)
    } catch (error) {
        throw new Error('Could not get names.')
    }
});

app.post(`/users`, async (req, res) => {
    try {
        await got.post(`${mainServicePath}/users`, {
            json: req.body
        });
        res.sendStatus(201)
    } catch (error) {
        throw new Error('Could not create user.')
    }
});

app.patch("/users/:id", async (req, res) => {
    try {
        await got.patch(`${mainServicePath}/users/${req.params.id}`, {
            json: req.body
        });
        res.sendStatus(200)
    } catch (error) {
        throw new Error('Could not update user.')
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        await got.delete(`${mainServicePath}/users/${req.params.id}`);
        res.sendStatus(200)
    } catch (error) {
        throw new Error('Could not delete user.')
    }
});

app.listen(process.env.CLIENT_PORT,
    () => console.log(`Example app listening on port ${process.env.CLIENT_PORT}!`));