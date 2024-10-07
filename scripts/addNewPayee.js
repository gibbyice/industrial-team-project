//const APIaddress = "http://34.201.132.70:3000/";
// Note this is incredibly easy to bypass by simply running localStorage.setItem("accountID", insert whatever you want here)
// but since security isnt a focus of this project i dont care <3
function addPayee(){
    payeeID = document.getElementById('accNum').value;
    payerID = localStorage.getItem("accountID");
    console.log(payerID)
    requestBody = {
        "payerID" : payerID,
        "payeeID": payeeID
    }
    requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // you prob just type out the body here tbh idk
    };
    // Make a GET request
    fetch(APIaddress+`addNewPayee/`, requestOptions)
        .then(response => {
            if (response.status === 404){
                throw new Error('No user matches provided ID');
            }
            else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Do the thing here
            localStorage.setItem("payeeID", payeeID) // stores id logged in with
            window.location.replace("../src/index.php"); // redirects to new page
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function confirmPayee() {
    payeeID = document.getElementById('accNum').value
    fetch(APIaddress+`confirmID/${payeeID}`)
    .then(response => {
        if (response.status === 200) {
            document.getElementById('payee-form').classList.add('hidden');
            document.getElementById('showAccount').classList.remove('hidden');
            return response.json();

        } else {
            console.log("account doesnt exist")
        }
    })
    .then(data => {
        updateDisplayWithData(data)
    })
    .catch(error => {
        console.log("Error somewhere", error)
	})
}

function updateDisplayWithData(data) {
    document.getElementById('payee-name').innerHTML = data.name;
    if (data.category != 'User') {
        document.getElementById('rag').classList.remove('hidden');
        document.getElementById('ce-text').innerText = `Carbon Emissions: ${data.ce}/10`
        document.getElementById('wm-text').innerText = `Waste Management: ${data.wm}/10`
        document.getElementById('sp-text').innerText = `Sustainability Practices: ${data.sp}/10`
        document.getElementById('sp').style.background = colourFromRAG(data.sp)
        document.getElementById('ce').style.background = colourFromRAG(data.ce)
        document.getElementById('wm').style.background = colourFromRAG(data.wm)
    }
}

function colourFromRAG(RAG) {

    if (RAG < 4) {
        return "#f44336";
    } else if (RAG < 7) {
        return "#ffbf00"
    } else {
        return "#238823"
    }

}

function register(){
    console.log("register clicked")
}
    