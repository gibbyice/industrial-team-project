const APIaddress = "http://34.201.132.70:3000/";
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('companyID');

window.onload = getCompanyDetails() // runs fetchPayee immediatly on page load

function getCompanyDetails(){
    fetch(APIaddress+`Account/${ID}`)
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

            balanceField = document.getElementById('category')
            balanceField.innerHTML = `${data.category}`

            balanceField = document.getElementById('carbon-emissions')
            balanceField.innerHTML = `${data.carbon_emissions}/10`

            balanceField = document.getElementById('waste-management')
            balanceField.innerHTML = `${data.waste_management}/10`

            balanceField = document.getElementById('sustainability-practices')
            balanceField.innerHTML = `${data.sustainability_practices}/10`
        })
        .catch(error => {
            console.error('Error:', error);
        });
}