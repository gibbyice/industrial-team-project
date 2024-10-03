const APIaddress = "http://34.201.132.70:3000/";

window.onload = init() // runs fetchPayee immediatly on page load

function init(){
    getAccDetails()
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
