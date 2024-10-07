
# Pay-Per Trail API Documentation

## DB Stored Procedures

Some functionality of the API relies on stored procedures defined within the RDS instance the DB is hosted on. 
These procedures are written in PLPGSQL.

#### send_money

```
CREATE OR REPLACE PROCEDURE public.send_money(IN payerid integer, 
                                              IN payeeid integer, 
                                              IN amount numeric, 
                                              IN reference character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
payerid2 INTEGER;
BEGIN
UPDATE users
SET balance = balance - amount
WHERE userid = payerid;
UPDATE users
SET balance = balance + amount
WHERE userid = payeeid;
COMMIT;
payerid2 := payerid;
INSERT INTO transactions(payerid, payeeid, amount, date, reference) 
    VALUES (payerid, payeeid, amount, now(), reference);
IF (SELECT EXISTS(
    SELECT userid FROM users JOIN transactions ON transactions.payerid = payerid2 
    WHERE ((users.carbon_emissions + users.waste_management + users.sustainability_practices) / 30) >= 0.7 
    AND DATE_TRUNC('day', transactions.date) = current_date - 1)) = true THEN
IF (SELECT EXISTS(SELECT ((carbon_emissions + sustainability_practices + waste_management) / 30) as rag 
    FROM users 
    WHERE userid = payeeid)) = true THEN
UPDATE users SET streak = streak + 1 WHERE userid = payerid;
COMMIT;
ELSE
UPDATE users SET streak = 0 WHERE userid = payerid;
COMMIT;
END IF;
END IF;
END;
$procedure$
```

Input Parameters:
- payerid INTEGER: The userID of the sender
- payeeid INTEGER: The userID of the recipient
- amount NUMERIC: The amount of money being sent
- reference VARCHAR: The reference of the transaction

Output:
- None

This procedure, when called, will remove the amount send from the senders balance, add it to the recipients balance and add a record of the transaction to the transaction field. After these have completed successfully it will then check if the users streak.

#### add_xp

```
CREATE OR REPLACE PROCEDURE public.add_xp(IN payerid integer, IN payeeid integer, IN payment_amount numeric)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
Dxp INTEGER;
rag NUMERIC;
BEGIN
IF (SELECT category FROM users WHERE userid = payeeid) != 'User' THEN
SELECT SUM(carbon_emissions + waste_management + sustainability_practices)::NUMERIC / 30.0 FROM users WHERE userid = payeeid INTO rag;
Dxp := FLOOR(((rag * 1.5) + 0.5) * payment_amount)::INTEGER;
UPDATE users
SET xp = xp + Dxp
WHERE userid = payerid;
COMMIT;
CALL check_xp(payerid);
END iF;
END;
$procedure$
```

Input Parameters:
- payerid INTEGER: The userID of the sender
- payeeid INTEGER: The userID of the recipient
- amount NUMERIC: The amount of money being sent

Output:
- None

This procedure will add the amount of xp to the senders account equal to (1.5 * rag) + 0.5, where rag is the payees carbon emissions, waste management and sustainability practices score summed and divided by 30. Users do not have these scores, and as such no xp will be given to them. Then their xp will be checked for leveling up.

#### check_xp

```
CREATE OR REPLACE PROCEDURE public.check_xp(IN payerid integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
currentlevel INTEGER;
currentxp INTEGER;
BEGIN

SELECT green_score FROM users WHERE userid = payerid INTO currentlevel;
SELECT xp FROM users WHERE userid = payerid INTO currentxp;
currentxp = currentxp - (1000 * currentlevel);

IF currentxp >= 1000 THEN
UPDATE users
SET green_score = green_score + 1
WHERE userid = payerid;
COMMIT;
INSERT INTO account_reward (SELECT userid, rewardid FROM users JOIN rewards ON (currentlevel + 1) >= min_level WHERE userid = payerid);
IF currentxp >= 2000 THEN
CALL check_xp(payerid);
END IF;
END IF;

END;
$procedure$
```

Input parameters:
- payerid INTEGER: The userid of the person who's xp is being checked

Output:
- None

This procedure checks if the users xp is enough for them to level up. It will call recursively if the user has enough xp so that they can level up again. After each level up users will be given rewards that match their level

#### add_new_payee

```
CREATE OR REPLACE PROCEDURE public.add_new_payee(IN payerid integer, IN payeeid integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
payee_exists BOOLEAN;
BEGIN
SELECT EXISTS(SELECT 1 FROM users WHERE userid = payeeid) INTO payee_exists;
IF payee_exists THEN
INSERT INTO user_payee VALUES (payerid, payeeid); END IF;
END; $procedure$
```

Input Parameters:
- payerid INTEGER: The userID of the sender
- payeeid INTEGER: The userID of the recipient

Output:
- None

This procedure ensures the userid of the payee being added exists, and if it does it will add the payeeid as a payee od payerid.

## API Routes

#### confirmID

```
app.get('/confirmID/:userID', (req, res) => {  
  var userID = req.params.userID
  connection.one('SELECT name, category, carbon_emissions, waste_management, sustainability_practices FROM users WHERE userid = $1', userID)
  .then((data) => {
    if (data.hasOwnProperty('category')) {
      res.status(200).json({name: data.name, ce: data.carbon_emissions, wm: data.waste_management, sp: data.sustainability_practices, category: data.category})
    } else {
      res.status(400).json({Error: 'no user with specified ID'})  
    }
      
  })
  .catch((error) => {
    if (error.code = 'queryResultError.noData') {
      res.status(404).json({Error: 'no user with specified ID'})
    } else {
	res.status(500).json({Error: 'Error in querying server'})  
    }
  })  
})
```

GET patameters:
- userID: the id of the user to confirm

Output:
- users name, and environmental info if they exist
OR
- Error

This route is used to confirm a user exists with userID, returning some info about them if so.

#### checkLogin

```
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
```

GET parameters:
- userID: the id of the user to confirm

Output:
- users info, if they exist
OR
- Error

This route is used to confirm a user exists with userID, returning some info about them if so.

#### greenscore

```
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
```

GET parameters:
- userID: the id of the user to get green score from

Output:
- users info, if they exist
OR
- Error

This procedure returns a users green score

#### Account

```
app.get('/Account/:userID', (req, res) => {
  var userID = req.params.userID
  connection.one(`SELECT * FROM users WHERE userid = $1:value;`, userID)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(404).json({Error: "No user exists with that ID"})
  })
})
```

GET Parameters:
- userID: the id of the user to get info of

Outputs the users info

#### AddNewPayee

```
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
```

POST parameters:
- payerid: id of the payer
- payeeid: id of the payee

Return
- No data

This procedure adds a new payee for user payerid, with new payee payeeid

#### SendMoney

```
app.put('/SendMoney', jsonParser, (req, res) => {
  var payerID = req.body.payerID
  var payeeID = req.body.payeeID
  var amount = req.body.amount
  var reference = req.body.reference

  connection.one(`SELECT balance FROM users WHERE userid = $1:value;`, payerID)
  .then( async (data) => {
    if (data.balance < parseFloat(amount)){
      throw new Error('User doesnt have enough money')
    }
    try {
      await connection.none(`CALL send_money($1, $2, $3, $4);`, [payerID, payeeID, amount, reference]);
    } catch {
      throw new Error('Error in sending money')
    }

    try {
      await connection.none(`CALL add_xp($1, $2, $3)`, [payerID, payeeID, amount])
    } catch(err) {
	console.log(err)
      throw new Error('error in adding xp');
    }

    res.status(200).json({Error: "Sent Money Succesfully"})
    // actually doing the transfer 
  }) .catch((error) => {
    console.log("Error occured when retrieving account balance: " + error)
    res.status(500).json({Error: "Internal Server Error - Error occured when retrieving account balance"})
  })
})
```

POST parameters:
- payerid: the id of the sender
- payeeid: the id of the recipient
- amount: the amount of money being sent
- reference: the reference of the transaction

Returns:
No data

This procedure will attempt to send money from one user to the other, if the user doesnt have sufficient funds it will not proceed with the transaction, after successfully completing the transaction, xp will be added to the users account.

#### AddCompany

```
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
```

POST parameters:
- name: the name of the new company
- carbon: the carbon emissions rating of the new company
- waste: the waste management rating of the new company
- sustainability: the sustainability of the new company
- category: the category of the new comapny

Returns:
No Data

This function will take in information about a new company to be added to the database. The procedur will validate all the environmental scores are between 0 and 10 inclusively. It will also check the companies new category is valid, and included in the list of categories. After this the new company will be inserted into the database.


#### addUser

```
app.post('/addUser', jsonParser, (req, res) => {
  var name = req.body.name
  // Validate
  if (!(2 <= name.length && name.length <= 255)){
    return res.status(400).json({Error: "Please make sure your name's length is between 2 & 255 (inclusive)"})
  }
  // Execute
  connection.one(`INSERT INTO users (name, balance, Green_Score, streak, category, xp) 
    VALUES ($1, 1000, 0, 0, 'User', 0) 
    RETURNING *;`, name)
  .then((data) => {
    res.status(200).json({Message: "User successfully added.", userID: `${data.userid}`})
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).json({Error: "Inernal Server Error - Error adding user to database"})
  })
})
```

POST parameters:
- name: the name of the new user

Returns:
The new users ID

This procedure attempts to add a new user, it will ensure the users name is valid, and if so will add them to the db

#### UpdateCompanyRAG

```
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
```

POST parameter:
- companyID: the id of the company that needs its rag info changed

Returns
No Data

This procedure will attempt to update the RAG categories of a company if they are all valid numbers.

#### DeleteAccount

```
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
```

GET parameters:
- userID: the ID of the account to delete

Returns:
deletion status of user

This procedure will attempt to delete the record of the user with ID matching userID.

#### Transactions/Payer

```
app.get('/Transactions/Payer/:userID', (req, res) => {
  var userID = req.params.userID
  connection.many('SELECT transactionid, payerid, payeeid, name, amount, reference, date, carbon_emissions, waste_management, sustainability_practices, category FROM transactions JOIN users ON userid = payeeid WHERE userid != ${userID} AND payerid=${userID}) ORDER BY date DESC;', userID)
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})
```

GET paramaters:
- userID the ID to fetch payments FROM

Returns:
list of transactions

This function will select all transactions that came from user with id USERID and will return it in the response

#### Transactions/Payee

```
app.get('/Transactions/Payee/:userID', (req, res) => {
  var userID = req.params.userID
  connection.many('SELECT transactionid, payerid, payeeid, name, amount, reference, date, carbon_emissions, waste_management, sustainability_practices, category FROM transactions JOIN users ON userid = payerid WHERE userid != ${userID} AND payeeid=${userID}) ORDER BY date DESC;')
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})
```

GET Parameters:
- userID: the userid to fetch transactions TO

Output
list of transactions

This function will select all transactions that were sent to user with id USERID and will return it in the response

#### Transactions/all

```
app.get('/Transactions/all/:userID', (req, res) => {
  var userID = req.params.userID
  connection.many('SELECT transactionid, payerid, payeeid, name, amount, reference, date, carbon_emissions, waste_management, sustainability_practices, category FROM transactions JOIN users ON (userid = payerid OR userid = payeeid) WHERE userid != $1 AND (payeeid=$1 OR payerid=$1) ORDER BY date DESC;', userID)
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `ERROR: `, error)
  })
})
```

GET parameters:
- userID: the userID to fetch all transactions TO and FROM

Returns: 
list of transactions

This function will select and return all transactions from and to a user with id = userID. it will return them in decending order of date, meaning recent transactions come first in this list.

#### getTransactions (pageNum)

```
app.get('/getTransactions/:userID/:pageNum', (req, res) => {
  var userID = req.params.userID
  var offset = req.params.pageNum * 11
  connection.many('SELECT transactionid, payerid, payeeid, name, amount, reference, date, carbon_emissions + waste_management + sustainability_practices as "enviroImpactScore" FROM transactions JOIN users ON (userid = payerid OR userid = payeeid) WHERE userid != $1 AND (payeeid=$1 OR payerid=$1) ORDER BY date DESC LIMIT 11 OFFSET $2;', [userID,offset])
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `Account has no transactoins `, error)
    res.status(404).json({error})
  })
})
```

GET parameters:
- userID: ID of the user to get all transactions from and to
- pageNum: the page number the select is being done from

Returns:
a list of 11 transacions

This function is used for different pages of transaction, where 11 transactions are selected based on what page of transactions the user is viewing from. 

### getTransaction (transactionID)

```
app.get('/getTransaction/:userID/:transactionID', (req, res) => {
  var userID = req.params.userID
  var transactionID = req.params.transactionID
  connection.one('SELECT transactionid, payerid, payeeid, name, amount, reference, date, carbon_emissions, waste_management, sustainability_practices, category FROM transactions JOIN users ON (userid = payerid OR userid = payeeid) WHERE userid != $1 AND transactionid = $2', [userID, transactionID])
  .then((data) => {
    res.json(data)
  })
  .catch ((error) => {
    console.log( `transaction doesnt exist`, error)
    res.status(404).json({error})
  })
})
```

GET parameters:
- userID: the id of the user to get transaction details from
- transactionID: the transaction to retriev

returns:
info about the transactions and the user involved

This function will search the database for a transaction with id = transactionID and will include information about the users involved, returning a 404 if the transaction cannot be found

#### AddReward

```
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
```

GET parameters:
- accountID: the id of the user to give a reward to
- rewardID: the id of the reward to give to the user

Returns
insert query response

This function will insert into the database the ids for a user and a reward, adding to a joining table to indicate the user has that reward

#### ViewReward

```
app.get('/ViewRewards/:accountID', (req, res) => {
  var accountID = req.params.accountID
  connection.any(`SELECT name, TO_CHAR(DATE_TRUNC('second', expiry),'YYYY-MM-DD') as expiry, min_level, discount
    FROM rewards
    JOIN account_reward ON rewards.rewardid = account_reward.rewardid
    WHERE account_reward.accountid = $1;`,accountID)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((error) => {
    res.status(400).json({error: "error in fetching rewards"})
  })
})
```

GET parameters:
- accountID: the ID of the user to get rewards associated with from

Returns
list of rewards

This function will return a list of rewards the user has been given by using a joining table.

#### ClaimReward

```
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
```

GET parameters:
- accountID: the id of the account to claim the reward of
- rewatdID: the reward of the id to be claimed

Returns
results of deletion query

This function deletes the record within the linking table tying the user with id userID to the reward with id rewardID, effectively claiming/using the reward

#### BetterOptions

```
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
```

GET parameters:
- category: the category of buisnesses to search for better options for
- userID the users id to make sure they arent recommended

Returns:
A list of companies

This function returns a list of companies in the same category as the company/user selected. The list is returned in order of best environmental choice decending, making the best company come first.

#### getPayees

```
app.get('/:userID/getPayees', (req, res) => {
  var userID = req.params.userID
  connection.many('SELECT payeeid, name, carbon_emissions + waste_management + sustainability_practices as "enviroImpactScore" FROM user_payee JOIN users ON userid = payeeid WHERE payerid = $1:value ORDER BY name;', userID)
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
```

GET parameters:
- userID: the userid to get payees from

Returns
list of payees

This function returns all the payees associated with a given user, these are listed in alphabetical order, to make finding a payee easier.

#### deletePayee

```
app.get('/:userID/:payeeID/deletePayee', (req, res) => {
  var userID = req.params.userID
  var payeeID = req.params.payeeID
  connection.one('DELETE FROM user_payee WHERE payeeid = $1 AND payerid = $2 RETURNING *;', [payeeID, userID])
  .then((data) => {
    res.status(200).json({data})
  })
  .catch ((error) => {
    console.log(`Error deleting payee ${payeeID} for user ${userID}`)
    res.status(500).json({Error: `Internal Server Error - Error deleting payee ${payeeID} for user ${userID}`})
  })
})
```

GET parameters:
- userID: the userid to delete a payee from
- payeeID: the payee to delete

Returns
deletion message contents

This function deletes a payee from a users payee list by removing the record of this in the payee joining table

#### getAllCompanies

```
app.get('/getAllCompanies/:pageNum', (req, res) => {
  var offset = req.params.pageNum * 12 // 12 cause it displays 12 per page :shrug:
  connection.many('SELECT * FROM users WHERE category != \'User\' ORDER BY carbon_emissions + waste_management + sustainability_practices DESC LIMIT 12 OFFSET $1:value', offset)
  .then((data) => {
    res.status(200).json({data})
  })
  .catch ((error) => {
    console.log(`idk man smth went wrong` + error)
    res.status(500).json({Error: `Internal Server Error`})
  })
})
```

GET parameters:
- pageNum: the page number to display companies on

returns
list of companies

This function selects a list of companies to show from the list, and shows different companies based on what page you are on, this means later pages will have worse companies contained within

#### companyMaxPageCount

```
app.get('/companyMaxPageCount', (req, res) =>{
  connection.one('SELECT COUNT(*) FROM users WHERE category != \'User\'')
  .then((data) =>{
    maxPages = Math.ceil(data.count/12)
    res.status(200).json({"maxPages": maxPages})
  })
  .catch ((error) => {
    console.log(`idk man smth went wrong` + error)
    res.status(500).json({Error: `Internal Server Error`})
  })
})
```

Returns
integer

this function returns an integer representing how many pages are needed to show all companies within the database.

#### transactionMaxPageCount

```
app.get('/transactionMaxPageCount/:userID', (req, res) =>{
  var userID = req.params.userID
  // there may be a better way to do this query but like :shrug: it works
  connection.one(`SELECT count(*) FROM (
                    SELECT transactionid 
                    FROM transactions 
                    JOIN users ON (userid = payerid OR userid = payeeid) 
                    WHERE userid != 69 AND (payeeid=69 OR payerid=69) 
                    ORDER BY date DESC
                  )`, userID)
  .then((data) =>{
    maxPages = Math.ceil(data.count/11)
    res.status(200).json({"maxPages": maxPages})
  })
  .catch ((error) => {
    console.log(`idk man smth went wrong` + error)
    res.status(500).json({Error: `Internal Server Error`})
  })
})
```

GET parameters:
- userID: the id to search for transactions from or to

Returns
integer 

This function returns an integer representing how many pages are needed to show all the transactions to or from a user stored within the database.
