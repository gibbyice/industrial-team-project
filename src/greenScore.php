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
                <h3 class="card-title">Green Score: <strong id="level">Level 2</strong></h3>
                <p class="card-text">XP required for next level: <strong id="xp-needed">11</strong></p>
                <div class="progress green-score-progress mb-3">
                    <div class="progress-bar progress-bar-striped" role="progressbar" id="level-bar" style="width: 89%;" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100">89</div>
                </div>
                <p class="card-text mb-0">Green Streak: <strong id="streak">4 🔥</strong></p>
            </div>
        </div>

        <div class="card reward-card mt-4">
            <div class="card-body" id="rewards-list">
                <h4 class="card-title">Your rewards:</h4>
            </div>
        </div>
    </div>

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

    <!-- Footer Padding for Navigation -->
    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../scripts/greenScore.js"></script>
  </body>
</html>
