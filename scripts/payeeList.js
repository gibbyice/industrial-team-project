const APIaddress = "http://localhost:3000/";

window.onload = fetchPayees() // runs fetchPayee immediatly on page load

function redirect(){
    window.location.replace("../src/addNewPayee.php"); 
}

function fetchPayees(){
    userID = localStorage.getItem("accountID")
    console.log("fetching payees!")
    activeFirstChar = "" // init to "" to make sure the first payee always spawns a divider

    // Make a GET request
    fetch(APIaddress+`${userID}/getPayees`)
        .then(response => {
            if (response.status === 404){
                noPayees()
                throw new Error('User has no payees');
            }
            else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => { // renamed to result instead of data to minimise confusion for the following code
            // Do the thing here
            for (let i = 0; i < result.data.length; i++) { 
                currentFirstChar = result.data[i].name.charAt(0)
                if (activeFirstChar != currentFirstChar){
                    generateAlphabetDivider(currentFirstChar)
                    activeFirstChar = currentFirstChar
                }
                generatePayeeListItem(result.data[i])
              }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function noPayees(){
    message = document.createElement("h3");
    message.setAttribute('class', 'mb-2')
    message.innerHTML = "Oops - looks like you dont have any payees!"

    button = document.createElement("button");
    button.setAttribute('class', 'btn btn-success payment-form-btn')
    button.setAttribute('onclick', 'redirect()')
    button.innerHTML = "Click here to add some"

    popUp = document.createElement("div");
    popUp.setAttribute('class', 'payment-form-box mb-2')
    popUp.appendChild(message)
    popUp.appendChild(button)

    payeeList = document.getElementById('payee-list') // Get payee list
    payeeList.appendChild(popUp)
}

// Responsible for generating dividers between payees with different starting characters
function generateAlphabetDivider(currentFirstChar){
    //console.log(`Creating new divider with letter ${currentFirstChar}`)
    
    // generate divider
    divider = document.createElement("li");
    divider.setAttribute('class', 'list-group-item letter-header')
    divider.innerHTML = currentFirstChar

    // Add divider to payee list
    payeeList = document.getElementById('payee-list') // Get payee list
    payeeList.appendChild(divider)
}

// Responsible for actually creating the HTML for each payee's card thingy in the list
function generatePayeeListItem(data){
    payeeList = document.getElementById('payee-list')

    // Creating lable
    icon = document.createElement("img");
    if (data.enviroImpactScore != null){
        icon.setAttribute('src', 'icons/business.png')
    } else {
        icon.setAttribute('src', 'icons/person.png')
    }
    
    icon.setAttribute('alt', 'Payee Icon')
    icon.setAttribute('class', 'payee-icon me-3')

    payeeName = document.createElement("p");
    payeeName.innerHTML = data.name

    lable = document.createElement("div");
    lable.setAttribute('class', 'd-flex align-items-center')
    lable.appendChild(icon)
    lable.appendChild(payeeName)

    // Creating button group
    payBtn = document.createElement("button");
    payBtn.setAttribute('class', 'btn btn-sm btn-success payee-btn')
    payBtn.innerHTML = 'Pay'

    deleteBtn = document.createElement("button");
    deleteBtn.setAttribute('class', 'btn btn-sm btn-danger payee-btn')
    deleteBtn.innerHTML = 'Delete'

    btnGroup = document.createElement("div")
    btnGroup.setAttribute('class', 'button-group')
    btnGroup.appendChild(payBtn)
    btnGroup.appendChild(deleteBtn)

    // Final assembly
    payeeListItem = document.createElement("li")
    payeeListItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center')
    payeeListItem.appendChild(lable)
    payeeListItem.appendChild(btnGroup)

    // Add to payee list
    payeeList = document.getElementById('payee-list') // Get payee list
    payeeList.appendChild(payeeListItem)
}