<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Green score</title>
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

    <div class="container-fluid">
        <div class="card green-score-card">
            <div class="card-body">
                <h3 class="card-title">Green Score: <strong>Level 2</strong></h3>
                <p class="card-text">XP required for next level: <strong>11</strong></p>
                <div class="progress green-score-progress mb-3">
                    <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 89%;" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100">89</div>
                </div>
                <p class="card-text mb-0">Green Streak: <strong>4 🔥</strong></p>
            </div>
        </div>

        <div class="card reward-card mt-4">
            <div class="card-body">
                <h4 class="card-title">Your rewards:</h4>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex flex-column">
                        <p class="mb-0">£5 Costa Coffee Voucher</p>
                        <small>Expires: 20/12/2025</small>
                    </div>
                    <img src="https://via.placeholder.com/50" alt="Coffee Icon">
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex flex-column">
                        <p class="mb-0">15% off at Next</p>
                        <small>Unlocks at Level 5</small>
                    </div>
                    <img src="https://via.placeholder.com/50" alt="T-shirt Icon">
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Padding for Navigation -->
    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

  </body>
</html>
