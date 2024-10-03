const APIaddress = "http://34.201.132.70:3000/";
var currentPage = 0
var maxPages = -1 // used to prevent pagination going beyond the total number of companies

window.onload = init() // runs fetchPayee immediatly on page load

function init(){
    getAccDetails()
    getCompanies()
}

function getMaxPages(){
    fetch(APIaddress+`maxPageCount`)
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