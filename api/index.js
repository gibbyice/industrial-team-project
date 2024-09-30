const express = require('express') // Note to self: Go here if you forgot everything - https://expressjs.com/
const bodyParser = require('body-parser') // added to allow parsing of body for post reqs
const jsonParser = bodyParser.json() // needs to be passed in to post requests where the body is json
const cors = require('cors')
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
app.use(cors());

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

app.get('/confirmID/:userID', (req, res) => {  
  var userID = req.params.userID
  connection.one('SELECT EXISTS(SELECT userid FROM users WHERE userid = $1', userID)
  .then((data) => {
    console.log(data)
    if (data.exists === 't') {
      res.status(200)
    } else {
      res.status(400).json({Error: 'no user with specified ID'})  
    }
      
  })
  .catch((error) => {
    res.status(404).json({Error: 'Error in querying server'})  
  })  
})

// Checks if a user with a given ID exists, returns 200 if there is and 404 if not
app.get('/checkLogin/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one('SELECT * FROM users WHERE userID = $1', userID)
  .then(( data ) => {
    console.log("Account found - " + userID)
    res.status(200).json({Message: `Account found`})
  })
  .catch((error) => {
    console.log("User does not exist - " + userID)
    res.status(404).json({Error: `No user with ID ${userID} exists.`})
  })
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
    return res.status(400).json({Error: "Please make sure the company name's length is between 2 & 255 (inclusive)"})
  } 
  // Fetching categories
  connection.many(`SELECT DISTINCT category FROM users`)
  .then((data) => {
    var categories = new Array()
    // Extract categories from returned data
    for (let i = 0; i < data.length; i++) {
      if(data[i].category != null){
        categories.push(data[i].category)
      }
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

app.post('/addUser', jsonParser, (req, res) => {
  var name = req.body.name
  // Validate
  if (!(2 <= name.length && name.length <= 255)){
    return res.status(400).json({Error: "Please make sure your name's length is between 2 & 255 (inclusive)"})
  }
  // Execute
  connection.one(`INSERT INTO users (name, balance, Green_Score, streak, category) 
    VALUES ($1, 0, 0, 0, 'User') 
    RETURNING *;`, name)
  .then((data) => {
    console.log(data)
    res.status(200).json({Message: "User successfully added.", userID: `${data.userid}`})
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).json({Error: "Inernal Server Error - Error adding user to database"})
  })
})

app.put('/UpdateCompanyRAG', jsonParser, (req, res) => {
  var companyID = req.body.companyID
  var carbon = req.body.carbon
  var waste = req.body.waste
  var sustainability = req.body.sustainability
  if (!(0 <= carbon && carbon <= 10) && (0 <= waste && waste <= 10) && (0 <= sustainability && sustainability <= 10)){
    return res.status(400).json({Error: "Please make sure carbon, waste and sustainability ratings are all between 0 and 10 (inclusive)"})
  }
  connection.none(`UPDATE users SET carbon_emissions = $1:value , waste_management = $2:value , sustainability_practices = $3:value WHERE userID = $4:value`, [carbon, waste, sustainability, companyID])
  .then(
    res.status(200).json({Message: "Company information succesfully updated."})
  )
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).json({Error: "Inernal Server Error - Error updating user information"})
  })
})

//Deletes account from database using the corresponding ID
app.get('/DeleteAccount/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`DELETE FROM users
    WHERE userID = $1 
    RETURNING *;`,userID)
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log('ERROR: ', error)
  })
})

//Searches for all payments the user has made
app.get('/Transactions/Payer/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT * FROM transactions WHERE payerid = ${userID} ORDER BY date DESC;`)
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})

//Searches for all payments the user has received
app.get('/Transactions/Payee/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT * FROM transactions WHERE payeeid = ${userID} ORDER BY date DESC;`)
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})

//Searches for all transactions the user has made
app.get('/Transactions/all/:userID', (req, res) => {
  var userID = req.params.userID
  connection.any(`SELECT * FROM transactions WHERE payerid = ${userID} OR payeeid = ${userID} ORDER BY date DESC;`)
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})

//Adds a reward to the account reward table when when it is available to a user (i.e. when their green score is high enough)
app.get('/AddReward/:accountID/:rewardID', (req, res) => {
  var accountID = req.params.accountID
  var rewardID = req.params.rewardID
  connection.one(`INSERT INTO account_reward 
    (accountID, rewardID) VALUES ($1, $2)
    RETURNING *;`,[accountID, rewardID])
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log(`ERROR: `, error)
  })
})

//Searches for all rewards that are available to the user
app.get('/ViewRewards/:accountID', (req, res) => {
  var accountID = req.params.accountID
  connection.any(`SELECT *
    FROM rewards
    JOIN account_reward ON rewards.rewardid = account_reward.rewardid
    WHERE account_reward.accountid = $1;`,accountID)
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log(`ERROR: `, error)
  })
})

//Deletes entry from account reward table when user claims a reward
app.get('/ClaimReward/:accountID/:rewardID', (req, res) => {
  var accountID = req.params.accountID
  var rewardID = req.params.rewardID
  connection.one(`DELETE FROM account_reward
    WHERE account_reward.accountid = $1
    AND account_reward.rewardid = $2 RETURNING *;`,[accountID,rewardID])
  .then((data) => {
    res.json(data)
  })
  .catch((error) => {
    console.log(`ERROR: `, error)
  })
})

// Fetches top 3 options in category
app.get('/:category/:userID/BetterOptions', (req, res) => {
  var userID = req.params.userID
  var category = req.params.category
  connection.many('SELECT * FROM users WHERE userID != $1:value AND category = $2 ORDER BY carbon_emissions + waste_management + sustainability_practices DESC LIMIT 3', [userID, category])
  .then((data) => {
    res.status(200).json(data)
  })
  .catch ((error) => {
    console.log("Error getting best oprions in category: " + error)
    res.status(500).json({Error: "Internal Server Error - Failed to retreive options from database"})
  })
})

// Gets all saved payees for a user
app.get('/:userID/getPayees', (req, res) => {
  var userID = req.params.userID
  connection.many('SELECT payeeid, name FROM user_payee JOIN users ON userid = payeeid WHERE payerid = $1:value ORDER BY name;', userID)
  .then((data) => {
    res.status(200).json({data})
  })
  .catch ((error) => {
    if (error.code === 0){
      res.status(404).json({Message: `no payees exist for user ${userID}`})
      return 
    }
    console.log(`Error getting payees for user ${userID}:` + error)
    res.status(500).json({Error: `Internal Server Error - Error getting payees for user ${userID}`})
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
