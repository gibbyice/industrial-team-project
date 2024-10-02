const APIaddress = "http://localhost:3000/";

window.onload = fetchBalance();
window.onload = fetchTransactions();

function fetchBalance() {
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
        document.getElementById('balance').innerHTML = "£"+data.balance;
    })
    .catch(error => {console.log("ERROR: ", error)})
}

function fetchTransactions() {
    var userID = localStorage.getItem("accountID");
    fetch(APIaddress+`Transactions/all/${userID}`)
    .then(response => {
        if (response.status === 400) {
            throw new Error ('Error in fetching transaction info')
        } else if (!response.ok) {
            throw new Error ('Error in fetching transaction info')
        }
        return response.json()
    })
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            transactionList = document.getElementById('transaction-list');

            transaction = document.createElement('div');
            transaction.setAttribute('class', 'display-unit');
            transaction.setAttribute('id', 'ce');
            icon = document.createElement("img");
            icon.setAttribute('src', 'icons/business.png');
            icon.setAttribute('alt', 'Payee Icon');
            icon.setAttribute('class', 'payee-icon me-3');
            label = document.createElement('h3');
            label.setAttribute('class', "mb-5 text-center");
            label.appendChild(icon);
            transactionText = document.createElement('a');
            transactionText.innerHTML = data[i].name;
            label.appendChild(transactionText);
            transaction.appendChild(label);
            transactionList.appendChild(transaction);
        }
    })
    .catch(error => {console.log("ERROR: ", error)})
}