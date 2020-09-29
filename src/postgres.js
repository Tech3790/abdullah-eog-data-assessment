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
  try {
    await knex("user").insert(user)
  } catch (error) {
    throw new Error('Could not create user.')
  }
}

const listUsers = async (perPage, currentPage) => {
  try {
    return await knex("user").paginate({
      perPage,
      currentPage
    })
  } catch (error) {
    throw new Error('Could not get users.')
  }
}

const listFullNames = async (perPage, currentPage) => {
  try {
    const users = await knex("user").paginate({
      perPage,
      currentPage
    })
    return users.data.map(u =>
      u.first + ' ' + u.last
    )
  } catch (error) {
    throw new Error('Could not get names.')
  }
}

const updateUser = async (id, user) => {
  try {
    return await knex('user').where({ id }).update(user)
  } catch (error) {
    throw new Error('Could not update user.')
  }
}

const deleteUser = async (id) => {
  try {
    await knex('user').where({ id }).del()
  } catch (error) {
    throw new Error('Could not delete user.')
  }
}

module.exports = {
  createUser,
  listUsers,
  listFullNames,
  updateUser,
  deleteUser
};

// comments from Abdullah: 
// My datebase called eog and it has one table (user) that looks like this:

// "id"	      "bigint"		"PrimaryKey"
// "title"	  "text"			"notNull"
// "first"	  "text"			"nullable"
// "last"	    "text"			"nullable"
// "date"	    "date"			"notNull"
// "age"	    "text"			"notNull"
// "gender"	  "text"			"notNull"


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
