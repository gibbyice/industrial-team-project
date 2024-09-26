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
