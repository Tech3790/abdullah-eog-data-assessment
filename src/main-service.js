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
  await migrateUsers();
  res.send("rows updated!")
});

app.get("/users", async (_, res) => {
  const users = await listUsers();
  res.send(users)
});

app.get("/fullnames", async (_, res) => {
  const fullnames = await listFullNames()
  res.send(fullnames)
});

app.post("/users", async (req, res) => {

  const user = new User(
    req.body.title,
    req.body.first,
    req.body.last,
    req.body.age,
    req.body.gender,
    req.body.date)

  await createUser(user);

  res.sendStatus(201)

});

app.patch("/users/:id", async (req, res) => {
  await updateUser(req.params.id, new User(req.body.title, req.body.first, req.body.last, req.body.age, req.body.gender, req.body.date))
  res.send("updated!")
});

app.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id)
  res.send("deleted")
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
