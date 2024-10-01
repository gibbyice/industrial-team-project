<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title>Add New Payee</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
</head>

<body>
    <?php
    require 'navbar.html';
    ?>


    <div id="payee-form">
        <div class="title-container">
            <div class="title">
                <h1 class="oswaldMedium scaling-title-text">Add New Payee</h1>
            </div>
            <div class="divider"></div>
        </div>
        <div class="payment-form-container">
            <div class="payment-form-box">
                <h3 class="me-3"><strong>New Payee Details</strong></h3>
                <form action="#" onsubmit="confirmPayee()">
                    <div class="mt-3">
                        <input type="text" class="form-control" id="accNum" name="accNum" placeholder="Name or Account Number" required>
                    </div>
                    <div class="d-flex confirmation-btns mt-4">
                        <button class="btn btn-success payment-form-btn">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div id="showAccount" class="hidden">
        <div class="title-container">
            <div class="title">
                <h1 class="oswaldMedium scaling-title-text">Do these details look correct?</h1>
            </div>
            <div class="divider"></div>
        </div>
        <div id="showAccount" class="payment-form-container">
            <div class="payment-form-box">
                <h3 id="payee-name" class="mb-5 text-center">Name: <img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion</h3>
                <div id="rag" class="hidden">
                <div class="display-unit" id="ce">
                    <h3 id="ce-text">Carbon emissions: 2/10</h3>
                </div>

                <div class="display-unit" id="wm">
                    <h3 id="wm-text">Waste management: 3/10</h3>
                </div>

                <div class="display-unit" id="sp">
                    <h3 id="sp-text">Sustainability practices: 2/10</h3>
                </div>
                </div>
                <div class="d-flex confirmation-btns mt-5">
                    <button class="btn btn-secondary payment-form-btn" onclick="goBack()">Go Back</button>
                    <button class="btn btn-success payment-form-btn" onclick="addPayee()">Confirm</button>
                </div>
            </div>
        </div>
    </div>
</body>

</html>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../scripts/payment.js"></script>
<script src="../scripts/addNewPayee.js" type="text/javascript"></script>
