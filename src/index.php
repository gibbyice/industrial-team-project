<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Homepage</title>
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
            <h4 class="account-number" id="accountNum">AN: 000000001</h4>
            <h4 class="account-holder" id="username">Ross F</h4>
          </div>
          <h2 class="balance-display" id="balance">£1,115.65</h2>

          <hr class="account-divider">

          <div class="d-flex justify-content-around align-items-center button-group">
            <div class="text-center">
              <a href="pay.php" class="nav-link">
                <img src="icons/pay2.png" alt="Pay Icon" class="icon-btn mb-2" width="100px">
                <p>Pay</p>
              </a>
            </div>
            <div class="text-center">
              <a href="recentTransactions.php" class="nav-link">
                <img src="icons/recent-trans.png" alt="Recent Transactions Icon" class="icon-btn mb-2" width="100px">
                <p>Recent Trans.</p>
              </a>
            </div>
            <div class="text-center">
              <a href="greenScore.php" class="nav-link">
                <img src="icons/rewards.png" alt="Rewards Icon" class="icon-btn mb-2" width="100px">
                <p>Your Rewards</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Top companies section -->
      <div class ="green-score-card">
      <h1 >Top Rated Companies:</h1>
        <div> 
          <div style="min-height: 50vh" id="companies-list"> <!--style refused to work via a class for some fucking reason so inline it is-->
          <!--Content is auto generated-->

            

          </div>
          
          <!--pagination controls-->
          <div class="mt-4 container d-flex justify-content-between">
          <span class="carousel-control-prev-icon" onclick="prevPage()"></span>
          <p id="current-page">Page 1</p>
          <span class="carousel-control-next-icon" onclick="nextPage()"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../scripts/index.js"></script>
  </body>
</html>
