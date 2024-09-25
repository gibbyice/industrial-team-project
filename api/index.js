const express = require('express') // Note to self: Go here if you forgot everything - https://expressjs.com/
//const serverless = require('serverless-http') // only needed for deploying onto AWS Lambda
const app = express() // creates an instance of express called app
const port = 3000 //Only used to host locally for testing
const pgp = require('pg-promise')(/* options */) // required postgresql connection based on https://expressjs.com/en/guide/database-integration.html#postgresql
const fs = require('fs')
const sslInfo = {
    //cs: fs.readFileSync('./global-bundle.pem').toString(),
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
  connection.one(`SELECT Green_Score FROM users WHERE userid = $1;` [userID])
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
  connection.one(`SELECT * FROM users WHERE userid = $1;`, userID)
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

app.get('/AddNewPayee/:payerID/:payeeID', (req, res) => {

  var payerID = req.params.payerID
  var payeeID = req.params.payeeID
  connection.one(`CALL add_new_payee($1, $2)`, [payerID, payeeID])
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {console.log("ITS OVER! $1", error)})
})

app.get('/SendMoney/:payerID/:payeeID/:amount', (req, res) => {
  var payerID = req.params.payerID
  var payeeID = req.params.payeeID
  var amount = req.params.amount
  connection.one(`CALL send_money($1, $2, $3);`)
  .then((data) => {
    console.log("Sent money to user: ", data)
  })
  .catch((error) => {
    console.log("ERROR in sending money", error)
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
  // Doing queries as below ensures they are not vulnerable to SQL Injection attacks,
  // Please try do so in other queries
  connection.one(`INSERT INTO users 
    (userID, name, balance, 
    Green_Score, streak, carbon_emissions, 
    waste_management, sustainability_practices, category) 
    VALUES ($1, $2, $3, 
    $4, 0, $5, 
    $6, $7, $8) 
    RETURNING *;`, [userID, name, balance, greenscore, carbon, waste, sustainability, category])
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
