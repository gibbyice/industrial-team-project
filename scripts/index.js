const APIaddress = "http://34.201.132.70:3000/";
var currentPage = 0
var maxPages = 1

function getMaxPages(){
    userID = localStorage.getItem("accountID")
    fetch(APIaddress+`transactionMaxPageCount/${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            maxPages = data.maxPages
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function nextPage(){
    getMaxPages() // refreshes every time in case new companies added
    if (currentPage != maxPages-1){
        currentPage ++
        getTransactions()
    } 
}

function prevPage(){
    if (currentPage != 0){
        currentPage --
        getTransactions()
    } 
}

function getAccDetails(){
    userID = localStorage.getItem("accountID")
    fetch(APIaddress+`Account/${userID}`)
        .then(response => {
            if (response.status === 404){
                throw new Error('Account doesn\'t exist');
            }
            else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Do the thing here
            idField = document.getElementById('accountNum')
            idField.innerHTML = `Acc Num: ${data.userid}`
            nameField = document.getElementById('username')
            nameField.innerHTML = data.name
            balanceField = document.getElementById('balance')
            balanceField.innerHTML = `£${data.balance}`
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getBetterAlternatives(userID, category){
    `
    <div class="card green-score-card">
        <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
            <div class="d-flex justify-content-between">
            <h3 class="mt-2">FastFuel Corp.</h3>
            <h3 class="mt-2">Acc Num: 123</h3>
            </div>
            <div class="display-unit d-flex justify-content-between green-bg">
            <h3 class="mt-2">Carbon Emissions:</h3>
            <h3 class="mt-2">3/10</h3>
            </div>
            <div class="display-unit d-flex justify-content-between green-bg">
            <h3 class="mt-2">Waste Management:</h3>
            <h3 class="mt-2">3/10</h3>
            </div>
            <div class="display-unit d-flex justify-content-between green-bg">
            <h3 class="mb-0">Sustainability Practices:</h3>
            <h3 class="mb-0">4/10</h3>
            </div>
        </div>
    </div>
    `
    fetch(APIaddress+`${category}/${userID}/BetterOptions`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        // Do the thing here
        for (let i = 0; i < result.length; i++) {
            carbonRAG = ""
            wasteRAG = ""
            sustainabilityRAG = ""
            if(result[i].carbon_emissions > 6){
                console.log("green carbon")
                carbonRAG = "green-bg"
            } else if (result[i].carbon_emissions > 3){
                carbonRAG = "yellow-bg"
            }

            if(result[i].waste_management > 6){
                wasteRAG = "green-bg"
            } else if (result[i].waste_management > 3){
                wasteRAG = "yellow-bg"
            }

            if(result[i].sustainability_practices > 6){
                sustainabilityRAG = "green-bg"
            } else if (result[i].sustainability_practices > 3){
                sustainabilityRAG = "yellow-bg"
            }

            carouselItem = document.getElementById(`carouselItem${i}`);
            carouselItem.innerHTML = `<div class="card green-score-card">
                                            <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
                                                <div class="d-flex justify-content-between">
                                                    <h3 class="mt-2">${result[i].name}</h3>
                                                    <h3 class="mt-2">Acc Num: ${result[i].userID}</h3>
                                                </div>
                                                <div class="display-unit d-flex justify-content-between ${carbonRAG}">
                                                    <h3 class="mt-2">Carbon Emissions:</h3>
                                                    <h3 class="mt-2">${result[i].carbon_emissions}/10</h3>
                                                </div>
                                                <div class="display-unit d-flex justify-content-between ${wasteRAG}">
                                                    <h3 class="mt-2">Waste Management:</h3>
                                                    <h3 class="mt-2">${result[i].waste_management}/10</h3>
                                                </div>
                                                <div class="display-unit d-flex justify-content-between ${sustainabilityRAG}">
                                                    <h3 class="mb-0">Sustainability Practices:</h3>
                                                    <h3 class="mb-0">${result[i].sustainability_practices}/10</h3>
                                                </div>
                                            </div>
                                        </div>`
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showTransactionDetails(transactionID){
    userID = localStorage.getItem("accountID")
    // Fill in transaction details
    fetch(APIaddress+`getTransaction/${userID}/${transactionID}`)
    .then(response => {
        if (response.status === 404){
            displayNoTransactions()
            throw new Error('Transaction doesn\'t exist');
        }
        else if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Do the thing here
        titleText = document.getElementById('titleText')
        if (data.payerid == userID){
            titleText.innerHTML = `To ${data.name} - £${data.amount}`
        } else {
            titleText.innerHTML = `From ${data.name} + £${data.amount}`
        }

        document.getElementById('date').innerHTML = `On: ${data.date}`
        document.getElementById('reference').innerHTML = `Ref: ${data.reference}`

        titleIMG = document.getElementById('titleIMG')
        if (data.carbon_emissions === null) {
            document.getElementById('companyDetails').setAttribute('Class', 'd-none') // Dont display if user is a person

            titleIMG.setAttribute('src', 'icons/person.png')
        } else {
            document.getElementById('companyDetails').setAttribute('Class', '') // do display if user is a company

            titleIMG.setAttribute('src', 'icons/business.png')
            document.getElementById('carbon-emissions').innerHTML = `${data.carbon_emissions}/10`
            document.getElementById('waste-management').innerHTML = `${data.waste_management}/10`
            document.getElementById('sustainability-practices').innerHTML = `${data.sustainability_practices}/10`
            document.getElementById('alternativesTitle').innerHTML = `Better alternatives within the ${data.category} category`
            getBetterAlternatives(data.payeeid, data.category)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    var modal = new bootstrap.Modal(document.getElementById('TransactionDetails'));
    modal.show();
}

function generateTransactionListItem(data){
    userID = localStorage.getItem("accountID")
    from = document.createElement("p");
    from.setAttribute('class', 'mb-0')
    if (userID == data.payerid){
        from.innerHTML = `To `
    } else {
        from.innerHTML = `From `
    }
    from.innerHTML += data.name

    amount = document.createElement("p");
    amount.setAttribute('class', 'mb-0 mt-2')
    
    if (data.payerid == userID){
        amount.innerHTML += ` - £${data.amount}`
    } else {
        amount.innerHTML += ` + £${data.amount}`
    }

    icon = document.createElement("img");
    if (data.enviroImpactScore != null){
        icon.setAttribute('src', 'icons/business.png')
    } else {
        icon.setAttribute('src', 'icons/person.png')
    }
    icon.setAttribute('class', 'payee-icon me-3')
    icon.setAttribute('alt', 'payee icon')

    fromDiv = document.createElement("div");
    fromDiv.setAttribute('class', 'd-flex align-items-center mt-2');
    fromDiv.appendChild(icon)
    fromDiv.appendChild(from)

    listItem = document.createElement("button");
    listItem.setAttribute('onclick', `showTransactionDetails(this.id)`);
    listItem.setAttribute('id', data.transactionid);
    // Apply colour based on EIS
    if (data.enviroImpactScore > 20){
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between green-bg w-100')
    } else if (data.enviroImpactScore > 10){
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between yellow-bg w-100')
    } else if (data.enviroImpactScore != null) {
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between w-100')
    } else {
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between neutral-bg w-100')

    }

    listItem.appendChild(fromDiv)
    listItem.appendChild(amount)
    
    companyList = document.getElementById('transactions-list') // Get list
    companyList.appendChild(listItem)
}

function displayNoTransactions(){

    h3 = document.createElement("h3");
    h3.setAttribute('class', 'mb-0')
    h3.innerHTML = "Your account has not had any transactions yet."

    div = document.createElement("div");
    div.setAttribute('class', 'display-unit d-flex justify-content-center nav-link neutral-bg')
    div.appendChild(h3)

    companyList = document.getElementById('transactions-list') // Get list
    companyList.appendChild(div)
}

function getTransactions(){
    userID = localStorage.getItem("accountID")
    document.getElementById('transactions-list').innerHTML = "" // clear previous transactions
    fetch(APIaddress+`getTransactions/${userID}/${currentPage}`)
    .then(response => {
        if (response.status === 404){
            displayNoTransactions()
            throw new Error('Account has no transactions');
        }
        else if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        // Do the thing here
        document.getElementById('current-page').innerHTML = `Page ${currentPage+1}`
        for (let i = 0; i < result.length; i++) {
            generateTransactionListItem(result[i])
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function init(){
    getMaxPages()
    getAccDetails()
    getTransactions()
}

window.onload = init() // runs fetchPayee immediatly on page load