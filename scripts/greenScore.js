
const APIaddress = "http://34.201.132.70:3000/";
//const APIaddress = "http://localhost:3000/";

function addCard(name, discount, expiry) {
    return `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-column">
                <p class="mb-0">£${discount} ${name} Voucher</p>
                <small>Expires: ${expiry}</small>
            </div>
            <img src="https://via.placeholder.com/50" alt="Coffee Icon">
        </div>
        <hr>
    `
}

function fetchUserInfo() {
    var userID = localStorage.getItem("accountID");
    fetch(APIaddress+`Account/${userID}`)
    .then(response => {
        if (response.status === 400) {
            throw new Error ('Error in fetching account info')
        } else if (!response.ok) {
            throw new Error ('Error in fetching account info')
        }
        return response.json()
    })
    .then(data => {
        var userXP = data.xp - (data.green_score * 1000);
        document.getElementById('level').innerHTML = `Level ${data.green_score}`;
        document.getElementById('xp-needed').innerHTML = 1000 - (userXP);
        document.getElementById('streak').innerHTML = data.streak;
        document.getElementById('level-bar').innerHTML = userXP;
        document.getElementById('level-bar').style.width = `${(userXP / 1000) * 100}%`;
    })
    .catch(error => {console.log("ERROR ERROR ERROR!", error)})
}

function fetchDiscounts() {
    var userID = localStorage.getItem.accountID;
    userID = 70;
    fetch(APIaddress+`ViewRewards/${userID}`)
    .then(response => {
        if (response.status === 400) {
            throw new Error ('Error in fetching rewards')
        } else if (!response.ok) {
            throw new Error ('Error in fetching rewards')
        }
        return response.json()
    })
    .then(data => {
        var listDiv = document.getElementById('rewards-list')
        for (d of data) {
            listDiv.innerHTML += addCard(d.name, d.discount, d.expiry)
        }   
    })
}

function getMaxPages(){
    fetch(APIaddress+`companyMaxPageCount`)
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
        getCompanies()
    } else {
        console.log("next denied")
    }
}

function prevPage(){
    if (currentPage != 0){
        currentPage --
        getCompanies()
    } else {
        console.log("prev denied")
    }
}

function getCompanies(){
    fetch(APIaddress+`getAllCompanies/${currentPage}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        // Do the thing here
        document.getElementById('current-page').innerHTML = `Page ${currentPage+1}`
        document.getElementById('companies-list').innerHTML = "" // removes any companies alr in list
        for (let i = 0; i < result.data.length; i++) { 
            generateCompanyListItem(result.data[i])
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generateCompanyListItem(data){

    comapnyName = document.createElement("h3");
    comapnyName.setAttribute('class', 'mb-5 text-center')
    comapnyName.innerHTML = data.name

    companyCategory = document.createElement("h3");
    companyCategory.setAttribute('class', 'mb-5 text-center')
    companyCategory.innerHTML = data.category

    listItem = document.createElement("a");
    listItem.setAttribute('href', `companyDetails.php?companyID=${data.userid}`);
    // Apply colour based on EIS
    comapnyEIS = data.carbon_emissions + data.waste_management + data.sustainability_practices
    if (comapnyEIS > 20){
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between nav-link green-bg')
    } else if (comapnyEIS > 10){
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between nav-link yellow-bg')
    } else {
        listItem.setAttribute('class', 'display-unit d-flex justify-content-between nav-link')
    }

    listItem.appendChild(comapnyName)
    listItem.appendChild(companyCategory)

    companyList = document.getElementById('companies-list') // Get list
    companyList.appendChild(listItem)
}

var currentPage = 0
var maxPages = -1 // used to prevent pagination going beyond the total number of companies
fetchUserInfo();
fetchDiscounts();
getCompanies()
