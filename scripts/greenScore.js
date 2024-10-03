
const APIaddress = "http://localhost:3000/";

function addCard(name, discount, expiry) {
    return `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-column">
                <p class="mb-0">£${discount} ${name} Voucher</p>
                <small>Expires: ${expiry}</small>
            </div>
            <img src="https://via.placeholder.com/50" alt="Coffee Icon">
        </div>
        <hr>
    `
}

function fetchUserInfo() {
    var userID = localStorage.getItem("accountID");
    console.log(userID);
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
        var userXP = data.xp - (data.green_score * 1000);
        document.getElementById('level').innerHTML = `Level ${data.green_score}`;
        document.getElementById('xp-needed').innerHTML = 1000 - (userXP);
        document.getElementById('streak').innerHTML = data.streak;
        document.getElementById('level-bar').innerHTML = userXP;
        document.getElementById('level-bar').style.width = `${(userXP / 1000) * 100}%`;
    })
    .catch(error => {console.log("ERROR ERROR ERROR!", error)})
}

function fetchDiscounts() {
    var userID = localStorage.getItem.accountID;
    userID = 70;
    fetch(APIaddress+`ViewRewards/${userID}`)
    .then(response => {
        if (response.status === 400) {
            throw new Error ('Error in fetching rewards')
        } else if (!response.ok) {
            throw new Error ('Error in fetching rewards')
        }
        return response.json()
    })
    .then(data => {
        var listDiv = document.getElementById('rewards-list')
        for (d of data) {
            listDiv.innerHTML += addCard(d.name, d.discount, d.expiry)
        }   
    })
}

fetchUserInfo();
fetchDiscounts();