const APIaddress = "http://localhost:3000/";

window.onload = fetchPayees() // runs fetchPayee immediatly on page load

function redirect(){
    window.location.replace("../src/addNewPayee.php"); 
}

function fetchPayees(){
    userID = localStorage.getItem("accountID")
    console.log("fetching payees!")
    activeFirstChar = "" // init to "" to make sure the first payee always spawns a divider	
	payeeList = document.createElement("ul");
	payeeList.setAttribute('class', 'list-group-payee-list')
	payeeList.setAttribute('id', 'payee-list')
	payeeListContainer = document.getElementById('payee-list-container') // Get payee list
    payeeListContainer.appendChild(payeeList)

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

    // Creating label
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

    label = document.createElement("div");
    label.setAttribute('class', 'd-flex align-items-center')
    label.appendChild(icon)
    label.appendChild(payeeName)

    // Creating button group
	payLink = document.createElement("a");
	payLink.setAttribute('href', `addDetails.php?payeeID=${data.payeeid}&payeeName=${data.name}`);
    payBtn = document.createElement("button");
    payBtn.setAttribute('class', 'btn btn-sm btn-success payee-btn');
    payBtn.innerHTML = 'Pay';
	payBtn.setAttribute("action", "editsettings.php");
	payLink.appendChild(payBtn);

    deleteBtn = document.createElement("button");
    deleteBtn.setAttribute('class', 'btn btn-sm btn-danger payee-btn')
    deleteBtn.innerHTML = 'Delete'
	deleteBtn.onclick = function() {		
		fetch(APIaddress+`${userID}/${data.payeeid}/DeletePayee`)
			.then(response => {
				if (response.status === 404){
					document.getElementById('loginError').setAttribute('class', 'alert alert-danger mt-1') // display the error
					throw new Error('No user matches provided ID');
				}
				else if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				console.log("in the good");
				console.log(data);
				payeeList.remove();
				payeeList = document.createElement("ul");
				payeeList.setAttribute('class', 'list-group-payee-list')
				payeeList.setAttribute('id', 'payee-list')
				fetchPayees();
			})
			.catch(error => {
				console.error('Error:', error);
			})
	}


    btnGroup = document.createElement("div")
    btnGroup.setAttribute('class', 'button-group')
    btnGroup.appendChild(payLink)
    btnGroup.appendChild(deleteBtn)

    // Final assembly
    payeeListItem = document.createElement("li")
    payeeListItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center')
    payeeListItem.appendChild(label)
    payeeListItem.appendChild(btnGroup)

    // Add to payee list
    payeeList = document.getElementById('payee-list') // Get payee list
    payeeList.appendChild(payeeListItem)
}