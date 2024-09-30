function showConfirmation() {
    const amount = document.getElementById('amount').value;
    const reference = document.getElementById('reference').value;

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