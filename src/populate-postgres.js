require('dotenv').config({ path: __dirname + '/../.env' })
const csv = require('csvtojson');

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

const migrateUsers = async () => {
  try {
    const csvFilePath = __dirname + '/data-dump/people.csv'
    const data = await csv().fromFile(csvFilePath);

    const peopleArray = data.map(person => ({
      title: person.Title,
      first: person.First,
      last: person.Last,
      date: person.Date,
      age: person.Age,
      gender: person.Gender
    }))

    // Deletes ALL existing entries
    await knex('user').del()

    // Inserts new entries
    await knex.batchInsert('user', peopleArray, 1000)

  } catch (error) {
    throw new Error("Could not migrate users.")
  }
}

module.exports = {
  migrateUsers
};

/**
 * We have all of our users stored locally in a csv file
 * Now we need to take those users that have been painstakingly gathered
 * and put them into a service where multiple applications can take advantage
 * of them.
 * The filesize could be quite large (in theory) so we will want to utilize
 * streams for processing the data and sending it off to our new postgres database.
 *
 * We will also need a way to know once we have processed all of the data.
 *
 * Each line of data represents one user following the same schema we used
 * earlier when creating our table.
 */
