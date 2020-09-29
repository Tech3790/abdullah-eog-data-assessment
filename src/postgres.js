require('dotenv').config({ path: __dirname + '/../.env' })
const { attachPaginate } = require('knex-paginate');
attachPaginate();

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  },
  pool: { min: 0, max: 7 }
})

const createUser = async (user) => {
  await knex("user").insert(user)
}

const listUsers = async (perPage, currentPage) => {
  return await knex("user").paginate({
    perPage,
    currentPage
  })
}

const listFullNames = async (perPage, currentPage) => {
  const users = await knex("user").paginate({
    perPage,
    currentPage
  })

  console.log(users);
  return users.data.map(u =>
    u.first + ' ' + u.last
  )
}

const updateUser = async (id, user) => {
  await knex('user').where({ id }).update(user)
}

const deleteUser = async (id) => {
  await knex('user').where({ id }).del()
}

module.exports = {
  createUser,
  listUsers,
  listFullNames,
  updateUser,
  deleteUser
};

/**
 * You will need to setup a connection to the postgres database
 * that you just created in addition to that we will need one table
 * with the columns Id, Title, First, Last, Date, Age, Gender.
 *
 * We like to use the npm package "pg" for connecting to our database and
 * executing operations on it. Here is a link to the docs if you would like
 * to use the same library: https://node-postgres.com/.
 *
 * This should also be the place where you put all of your helper methods
 * for interacting with the database.
 *
 * If you create the table using the web interface for elephantsql then
 * please put the creation schema in a comment in this file. If you create
 * the table using a query defined in this file then you can skip this step.
 */
