const APIaddress = "http://34.201.132.70:3000/";

// Note this is incredibly easy to bypass by simply running localStorage.setItem("accountID", insert whatever you want here)
// but since security isnt a focus of this project i dont care <3
function login(){
    console.log("running login")
    form = document.getElementById('loginForm')
    accountID = form.elements.loginAccNum.value
    document.getElementById('loginError').setAttribute('class', 'd-none') // hide the error
    // Make a GET request
    fetch(APIaddress+`checkLogin/${accountID}`)
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
            // Do the thing here
            console.log("in the good")
            localStorage.setItem("accountID", accountID) // stores id logged in with
            window.location.replace("../src/index.php"); // redirects to new page
        })
        .catch(error => {
            console.error('Error:', error);
            form.elements.loginAccNum.valid
        });
}

function register(){
    form = document.getElementById('regForm')
    accountName = form.elements.regAccName.value

    regError = document.getElementById('RegisterError')
    regSuccess = document.getElementById('RegisterSuccess')
    regError.setAttribute('class', 'd-none') // hide error
    regSuccess.setAttribute('class', 'd-none')

    // Doing client side validation mainly cause its faster than waiting for the response
    if (!(2 < accountName.length && accountName.length < 255)) {
        regError.setAttribute('class', 'alert alert-danger mt-1') // display error
        return
    }

    // Create request body
    requestBody = {
        "name" : accountName
    }

    // Create request options
    requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // you prob just type out the body here tbh idk
    };

    // Api call
    fetch(APIaddress+`addUser`, requestOptions)
        .then(response => {
            if (response.status === 400){
                // still responds to server side validation in case user bypassed it or smth idk :P
                regError.setAttribute('class', 'alert alert-danger mt-1') // display error
                throw new Error('Please make sure your name\'s length is between 2 & 255 (inclusive)');
            }
            else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Do the thing here
            console.log("success")
            regSuccess.setAttribute('class', 'my-0 alert alert-success mt-1')
            regSuccess.innerHTML = `Account added successfully, your ID is: ${data.userID}.`
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
