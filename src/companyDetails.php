<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Company Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
  </head>
  <body>
    <?php
      require 'navbar.html';
    ?>

    <div class="title-container">
      <div class="title">
        <h1 class="company-title scaling-title-text">Pay-Per Trail <img class="mb-4 scaling-logo" src="icons/logo.png" alt="company logo"></h1>
      </div>
      <div class="divider"></div>
    </div>

    <div class="container-fluid mt-4">
      <div class="card green-score-card">
        <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="account-holder" id="username"></h4>
            <h4 class="account-number" id="accountNum"></h4>
          </div>
          <h2 class="balance-display" id="category"></h2>

          <hr class="account-divider">
            <div class="d-flex justify-content-between">
                <h4 class="account-number">Carbon Emissions:</h4>
                <h4 class="account-number" id="carbon-emissions">0/10</h4>
            </div>
            <div class="d-flex justify-content-between">
            <h4 class="account-number">Waste Management:</h4>
            <h4 class="account-number" id="waste-management">0/10</h4>
            </div>
            <div class="d-flex justify-content-between">
            <h4 class="account-number">Sustainability-Practices:</h4>
            <h4 class="account-number" id="sustainability-practices">0/10</h4>
            </div>
        </div>
      </div>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../scripts/companyDetails.js">getCompanyDetials()</script>
  </body>
</html>
