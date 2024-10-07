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
              <a href="addNewPayee.php" class="nav-link">
                <img src="icons/add-new-payee.png" alt="add payee icon" class="icon-btn mb-2" width="100px">
                <p>Add Payee</p>
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
        <h1 >Your transactions:</h1>
        <div> 
          <div id="transactions-list">
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

      <!-- Modal -->
      <div class="modal fade" id="TransactionDetails" tabindex="-1" aria-labelledby="TransactionDetails" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 90%; min-height: 100%">
          <div class="modal-content dark-bg">
            <div class="modal-header">
              <h1 class="modal-title" id="TransactionDetails">
                  <div class="d-flex align-items-center">
                    <img src="icons/person.png" class="payee-icon me-3" alt="payee icon" id="titleIMG">
                    <p class="mb-0" id="titleText">From Naomi Silver + £35.00</p>
                  </div>
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
              <p class="fs-1" id="date">Occured At 2024-10-04T01:09:22.341Z:</p>
              <p class="fs-1" id="reference">Ref: "Money for a way out of this madness"</p>

              <div id = "companyDetails">
                <div class="d-flex justify-content-between">
                  <p class="fs-1">Carbon Emissions:</p>
                  <p class="fs-1" id="carbon-emissions">0/10</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="fs-1">Waste Management:</p>
                  <p class="fs-1" id="waste-management">0/10</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="fs-1">Sustainability-Practices:</p>
                  <p class="fs-1" id="sustainability-practices">0/10</p>
                </div>

                <hr class="account-divider">

                <p class="mb-2 mt-2 fs-1 text-center" id="alternativesTitle">Better alternatives within the Technology category</p>
                
                <!--Carousel-->
                <div id="altCompanies0" class="carousel slide pointer-event">
                <div class="carousel-indicators m-0 mt-5">
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                <div class="carousel-inner" id="carousel-inner">
                  <!--Content is auto generated-->
                  <div class="carousel-item active" id="carouselItem0">

                  </div>
                  <div class="carousel-item" id="carouselItem1">
                    
                  </div>
                  <div class="carousel-item" id="carouselItem2">
                  
                  </div>
                </div>

                <button class="carousel-control-prev carousel-control-prev-icon carousel-nav" type="button" data-bs-target="#altCompanies0" data-bs-slide="prev">
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next carousel-control-next-icon carousel-nav" type="button" data-bs-target="#altCompanies0" data-bs-slide="next">
                    <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary fs-1" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>

    </div>

    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../scripts/index.js"></script>
  </body>
</html>
