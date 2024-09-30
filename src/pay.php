<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Pay and Transfer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
    <?php
        require 'navbar.html';
    ?>

    <div class="title-container">
        <div class="title">
            <h1 class="oswaldMedium scaling-title-text">Send money to?</h1>
        </div>
        <div class="divider"></div>
    </div>

    <div class="container-fluid">
        <ul class="list-group payee-list">

          <li class='list-group-item letter-header'>E</li> <!-- temporary for now, will be implemented properly when php fetches get added :D -->

            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">
                    <p>Eco farm produce</p>
                </div>
                <div class="button-group">
                    <a href="addDetails.php"><button class="btn btn-sm btn-success payee-btn">Pay</button></a>
                    <button class="btn btn-sm btn-danger payee-btn">Delete</button>
                </div>
            </li>

          <li class='list-group-item letter-header'>N</li> <!-- temporary for now, will be implemented properly when php fetches get added :D -->

            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="icons/person.png" alt="Payee Icon" class="payee-icon me-3">
                    <p>Naomi Silver</p>
                </div>
                <div class="button-group">
                    <a href="addDetails.php"><button class="btn btn-sm btn-success payee-btn">Pay</button></a>
                    <button class="btn btn-sm btn-danger payee-btn">Delete</button>
                </div>
            </li>
        </ul>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div>

</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html>
