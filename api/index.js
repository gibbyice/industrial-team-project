const express = require('express') // Note to self: Go here if you forgot everything - https://expressjs.com/
const bodyParser = require('body-parser') // added to allow parsing of body for post reqs
const jsonParser = bodyParser.json() // needs to be passed in to post requests where the body is json
//const serverless = require('serverless-http') // only needed for deploying onto AWS Lambda
const app = express() // creates an instance of express called app
const port = 3000 //Only used to host locally for testing
const pgp = require('pg-promise')(/* options */) // required postgresql connection based on https://expressjs.com/en/guide/database-integration.html#postgresql
const fs = require('fs')
const internal = require('stream')
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
  connection.one(`SELECT Green_Score FROM users WHERE userid = $1:value;`, userID) // note to self :P using :value after the variable is a formatting filter to protect from sql injection - https://github.com/vitaly-t/pg-promise#formatting-filters
  .then((data) => {
    return res.status(200).json({data})
  })
  .catch((error) => {
    console.log('ERROR:', error)
    return res.status(404).json({Error: "No user exists with that ID"})
  })
})

//Returns a user's information based on the user ID provided
app.get('/Account/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT * FROM users WHERE userid = $1:value;`, userID)
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(404).json({Error: "No user exists with that ID"})
  })
})

// allows a user to register a new payee
app.post('/AddNewPayee', jsonParser, (req, res) => {
  var payerID = req.body.payerID
  var payeeID = req.body.payeeID
  connection.none(`CALL add_new_payee($1, $2)`, [payerID, payeeID])
  .then( 
    res.status(200).json({Message: "Payee was added successfully."})
  )
  .catch((error) => {
    console.log("ITS OVER! $1", error)
    res.status(400).json({Error: "Something went wrong, please verify the specified accounts exist."})
  })
})

// Sends money from 1 account to another
app.put('/SendMoney', jsonParser, (req, res) => {
  var payerID = req.body.payerID
  var payeeID = req.body.payeeID
  var amount = req.body.amount

  // verifying sufficient funds in account
  connection.one(`SELECT balance FROM users WHERE userid = $1:value;`, payerID)
  .then( data => {
    if (data.balance < amount){
      return res.status(400).json({Error: "Insufficient funds in your account."})
    }

    // actually doing the transfer 
    connection.one(`CALL send_money($1, $2, $3);`, [payerID, payeeID, amount])
    .then(
      res.status(200).json({Message: `Sent ${amount} to user ${payeeID} successfully.`})
    )
    .catch((error) => {
      console.log("ERROR in sending money", error)
      res.status(400).json({Message: `Something went wrong, please verify the specified accounts exist.`})
    })

  }) .catch((error) => {
    console.log("Error occured when retrieving account balance: " + error)
    res.status(500).json({Error: "Internal Server Error - Error occured when retrieving account balance"})
    return
  })
})

//Adds a user to the database using the parameters as the user's information.
// This is very long and i did want to break up the fetching categories into its own function but it seemed to need to be async and then making it async didnt seem to help so idk :p
app.post('/AddCompany', jsonParser, (req, res) => {
  var name = req.body.name
  var carbon = req.body.carbon
  var waste = req.body.waste
  var sustainability = req.body.sustainability
  var category = req.body.category

  // basic validation
  if (!(0 <= carbon && carbon <= 10) && (0 <= waste && waste <= 10) && (0 <= sustainability && sustainability <= 10)){
    return res.status(400).json({Error: "Please make sure carbon, waste and sustainability ratings are all between 0 and 10 (inclusive)"})
  } else if (!(2 <= name.length && name.length <= 255)){
    return res.status(400).json({Error: "Please make sure the companie name's length is between 2 & 255 (inclusive)"})
  } 
  // Fetching categories
  connection.many(`SELECT DISTINCT category FROM users`)
  .then((data) => {
    var categories = new Array(data.length)
    // Extract categories from returned data
    for (let i = 0; i < data.length; i++) {
      categories[i] = data[i].category
    } 
    // Validate provided category
    if (!categories.includes(category)){
      return res.status(400).json({Error: `Please make sure the category entered is one of the following: ${categories}`}) 
    }
    // Finally actually do the thing
    // Doing queries as below ensures they are not vulnerable to SQL Injection attacks,
    // Please try do so in other queries
    connection.one(`INSERT INTO users 
      (name, balance, 
      Green_Score, streak, carbon_emissions, 
      waste_management, sustainability_practices, category) 
      VALUES ($1, 1000, 0, 
      0, $2, 
      $3, $4, $5) 
      RETURNING *;`, [name, carbon, waste, sustainability, category])
    .then(
      res.status(200).json({Message: "Company successfully added."})
    )
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).json({Error: "Inernal Server Error - Error adding company to database"})
    })
  })
  .catch ((error) => {
    console.log("Error retrieving categories: " + error)
    res.status(500).json({Error: "Internal Server Error - Error retrieving categories."})
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
