const { migrateUsers } = require("./populate-postgres");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { listUsers, listFullNames, createUser, updateUser, deleteUser } = require("./postgres");
const User = require("./user-model");

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
    await migrateUsers();
    res.send("rows updated!")
  } catch (error) {
    throw new Error('Could not migrate users.')
  }

});

app.get("/users", async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 10 // default number of results per page
    const currentPage = Number(req.query.currentPage) || 1 // default page number
    const users = await listUsers(perPage, currentPage);

    res.send(users)
  } catch (error) {
    throw new Error('Could not get users.')
  }

});

app.get("/fullnames", async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 10
    const currentPage = Number(req.query.currentPage) || 1
    const fullnames = await listFullNames(perPage, currentPage)

    res.send(fullnames)
  } catch (error) {
    throw new Error('Could not get names.')
  }

});

app.post("/users", async (req, res) => {

  try {
    const user = new User(
      req.body.title,
      req.body.first,
      req.body.last,
      req.body.date,
      req.body.age,
      req.body.gender)
      
    await createUser(user);
    res.sendStatus(201)
  } catch (error) {
    throw new Error('Could not create user.')
  }

});

app.patch("/users/:id", async (req, res) => {
  try {
    const user = new User(
      req.body.title,
      req.body.first,
      req.body.last,
      req.body.date,
      req.body.age,
      req.body.gender)

    await updateUser(req.params.id, user)

    res.send("updated!")
  } catch (error) {
    throw new Error('Could not update user.')
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    throw new Error('Could not delete user.')
  }
})

app.listen(process.env.MAIN_SERVICE_PORT,
  () => console.log(`Example app listening on port ${process.env.MAIN_SERVICE_PORT}!`));

/**
 * Your main service should implement CRUD operations on the postgres database
 * for the users table. There are some simple route definitions listed as examples
 * to help you get started. Feel free to deviate from the examples if you wish.
 *
 * Make sure to handle any errors that could arise as well!
 */

/**
 * method: GET
 * route: /migrate-users
 * purpose: Use the function(s) written in ../populate-postgres as a job that is
 * run whenever this route is hit.
*/

/**
 * method: GET
 * route: /users
 * purpose: Return an array of users
 * bonus: Support pagination
 */

/**
 * method: GET
 * route: /fullnames
 * purpose: Return an array of the first and last name for each user
 */

/**
 * method: POST
 * route: /users
 * purpose: Add a new user to the database
 */

/**
 * method: PATCH
 * route: /users
 * purpose: Update a user record
 */

/**
 * method: DELETE
 * route: /users
 * purpose: Remove a given user
 */
