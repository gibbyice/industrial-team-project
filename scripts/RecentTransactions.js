//const APIaddress = "http://localhost:3000/";
const APIaddress = "http://34.201.132.70:3000/";
const userID = localStorage.getItem("accountID");

window.onload = fetchBalance();
window.onload = fetchTransactions();

function fetchBalance() {
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
        CreateCards(data);
    })
    .catch(error => {console.log("ERROR: ", error)})
}

function CreateCards(data) {
    for (let i = 0; i < data.length; i++) {
        transactionList = document.getElementById('transaction-list');
        transaction = document.createElement('button');
        transaction.setAttribute('class', 'display-unit');
        enviroScore = data[i].carbon_emissions+data[i].waste_management+data[i].sustainability_practices;
        if (enviroScore >=24 || data[i].carbon_emissions == null) {
            transactionColour = "13b955"
        }
        else if (enviroScore >=12) {
            transactionColour = "eea036"
        }
        else {
            transactionColour = "f44336"
        }
        transaction.setAttribute("style", `background-color:#`+transactionColour+`;color:white;padding: 10px;margin: 10px 0;border-radius: 5px;width: 100%;height: 80px;text-align: center;font-size: 18px;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1)`);
        icon = document.createElement("img");
        if (data[i].carbon_emissions != null) {
            icon.setAttribute('src', 'icons/business.png');
        }
        else {
            icon.setAttribute('src','icons/person.png')
        }
        icon.setAttribute('alt', 'Payee Icon');
        icon.setAttribute('class', 'payee-icon me-3');
        label = document.createElement('h3');
        label.setAttribute('class', "mb-5 text-center");
        label.appendChild(icon);
        transactionLabel = document.createElement('a');
        sign = ""
        if (data[i].payerid == userID) {
            sign = "-"
        } else {
            sign = "+"
        }
        transactionText = data[i].name+" : "+sign+"£"+data[i].amount;
        transactionLabel.innerHTML = data[i].name+" : "+sign+"£"+data[i].amount;
        label.appendChild(transactionLabel);
        transaction.appendChild(label);
        modalContainer = document.getElementById('modal-container');
        modalNum = "transactionModal"+i
        modal=document.createElement("div")
        modal.setAttribute('id', modalNum)
        modal.setAttribute('class', 'modal fade')
        modal.setAttribute('tabindex', '-1')
        modal.setAttribute('aria-labelledby', 'transactionModalLabel')
        modal.setAttribute('aria-hidden', 'true')
        if (data[i].carbon_emissions >= 8) {
            carbonColor = "success"
        }
        else if (data[i].carbon_emissions >= 4) {
            carbonColor = "warning"
        }
        else {
            carbonColor = "danger"
        }
        if (data[i].waste_management >= 8) {
            wasteColor = "success"
        }
        else if (data[i].waste_management >= 4) {
            wasteColor = "warning"
        }
        else {
            wasteColor = "danger"
        }
        if (data[i].sustainability_practices >= 8) {
            susColor = "success"
        }
        else if (data[i].sustainability_practices >= 4) {
            susColor = "warning"
        }
        else {
            susColor = "danger"
        }

        innerHTML=`<div class="modal-dialog modal-dialog-centered" style="max-width: 80%; min-height: 100%">
                <div class="modal-content" style="background-color: rgb(43, 48, 53);">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transactionModalLabel">Transaction details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modal-body">
                        <div class="text-center">
                            <h4>`+transactionText+`</h4>
                            <p>`+data[i].date+`</p>
                            <p>"`+data[i].reference+`"</p>
                        </div> `
        if (data[i].carbon_emissions != null) { 
            innerHTML+=`<div class="score">
                                <div class="score-item bg-`+carbonColor+` mt-3 text-center">`+data[i].carbon_emissions+`</div>
                                <div class="score-item bg-`+wasteColor+` mt-3 text-center">`+data[i].waste_management+`</div>
                                <div class="score-item bg-`+susColor+` mt-3 text-center">`+data[i].sustainability_practices+`</div>
                            </div>
                            <div id="altCompanies`+i+`" class="carousel slide my-5">
                                
                            </div>`
                        
            if (data[i].payerid == userID) {
                id = data[i].payeeid
            }
            else {
                id = data[i].payerid
            }
            fetchAlternatives(id,data[i].category,i);
        }
        innerHTML+=`</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>`
        modal.innerHTML=innerHTML

        modalContainer.appendChild(modal)
        const showDetailsModal = new bootstrap.Modal(document.getElementById(modalNum.toString()));
        transaction.onclick = function() {
            showDetailsModal.show();
        }
        transactionList.appendChild(transaction);
    }
}

function fetchAlternatives(id,category,i) {
    return fetch(APIaddress+category+`/`+id+`/BetterOptions`)
    .then(response => {
        if (response.status === 400) {
            throw new Error ('Error in fetching transaction info')
        } else if (!response.ok) {
            throw new Error ('Error in fetching transaction info')
        }
        return response.json()
    })
    .then(data => {
        carousels = ""
        carouselContainer=document.getElementById("altCompanies"+i)
        for (let j = 0; j < data.length; j++) {
            if (j == 0) {
                carousels+=`<div class="carousel-item active">`
            }
            else {
                carousels+=`<div class="carousel-item">`
            }
            carousels+=`    <div class="card green-score-card">
                                <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
                                    <h5 class="text-center">`+data[j].name+`</h5>
                                </div>
                            </div>
                        </div>`
        }
        carouselContainer.innerHTML=carousels+`
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#altCompanies`+i+`" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#altCompanies`+i+`" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>`

    })
    .catch(error => {console.log("ERROR: ", error)})
}
