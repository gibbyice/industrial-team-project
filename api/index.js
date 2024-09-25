const express = require('express') // Note to self: Go here if you forgot everything - https://expressjs.com/
//const serverless = require('serverless-http') // only needed for deploying onto AWS Lambda
const app = express() // creates an instance of express called app
const port = 3000 //Only used to host locally for testing
const pgp = require('pg-promise')(/* options */) // required postgresql connection based on https://expressjs.com/en/guide/database-integration.html#postgresql
const fs = require('fs')
const sslInfo = {
    cs: fs.readFileSync('./global-bundle.pem').toString(),
    rejectUnauthorized: false
}

const connInfo = {
    host: 'psql-db.cxqmy8c800g2.eu-west-2.rds.amazonaws.com',  // e.g., 'your-instance-name.region.rds.amazonaws.com'
    port: 5432,
    database: 'bank_info',
    user: 'postgres',
    password: 'AWS2024ITPatUoD',
    ssl: sslInfo
}


// connection format is 'postgres://username:password@host:port/database'
const connection = pgp(connInfo) 

// may be a problem with how i have lambda set up but the base route doesnt appear to be accesible
app.get('/', (req, res) => {
  res.send('wee woo base route')
})

app.get('/hello', (req, res) => {
    res.send('hello :)')
})

// Returns a user's greenscore based on the account number provided
app.get('/:userID/greenscore', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT Green_Score FROM users WHERE userid = ${userID};`)
  .then((data) => {
    console.log('DATA: ', data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

//Returns a user's information based on the user ID provided
app.get('/Account/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT * FROM users WHERE userid = ${userID};`)
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

//Adds a user to the database using the parameters as the user's information.
app.get('/AddAccount/:userID/:name/:balance/:greenscore/:carbon/:waste/:sustainability/:category', (req, res) => {
  var userID = req.params.userID
  var name = req.params.name
  var balance = req.params.balance
  var greenscore = req.params.greenscore
  var carbon = req.params.carbon
  var waste = req.params.waste
  var sustainability = req.params.sustainability
  var category = req.params.category
  connection.one(`INSERT INTO users (userID, name, balance, Green_Score, streak, carbon_emissions, waste_management, sustainability_practices, category) VALUES (${userID}, ${name}, ${balance}, ${greenscore}, 0, ${carbon}, ${waste}, ${sustainability}, ${category}) RETURNING *;`, )
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

// Catches all requests to non existant routes, MUST be after all other routes
app.all('*', (req, res) => {
  res.status(404).json({Error: "no such route exists"})
})

// Only used to host locally for testing
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})  

//module.exports.handler = serverless(app) // only needed for deploying onto aws lambda
