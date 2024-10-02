const APIaddress = "http://34.201.132.70:3000/";
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('payeeID');
const Name = urlParams.get('payeeName')
const userID = localStorage.getItem("accountID")
let amount = 0;
let reference = "";

function showConfirmation() {
    amount = document.getElementById('amount').value;
    reference = document.getElementById('reference').value;

    document.getElementById('confirm-amount').innerText = `£${amount}`;
    document.getElementById('confirm-reference').innerText = reference;

    document.getElementById('payment-form').classList.add('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
}

function editDetails() {
    document.getElementById('confirmation').classList.add('hidden');
    document.getElementById('payment-form').classList.remove('hidden');
}

function confirmPayee() {
    document.getElementById('payee-form').classList.add('hidden');
    document.getElementById('showAccount').classList.remove('hidden');
}

function goBack() {
    document.getElementById('showAccount').classList.add('hidden');
    document.getElementById('payee-form').classList.remove('hidden');
}

function makeTransaction() {
	
	requestBody = {
        "payerID" : localStorage.getItem("accountID"),
		"payeeID" : ID,
		"amount" : amount,
		"reference" : reference
    }
	
    requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    };
	console.log(requestBody)
	console.log(requestOptions)

    fetch(APIaddress+`SendMoney`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("success")success")
			window.location.replace("../src/faq.php")
        })
        .catch(error => {
            console.error('Error:', error);
        });
}