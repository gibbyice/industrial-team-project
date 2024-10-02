<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title>Recent Transactions</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
</head>

<body>
    <?php
    require 'navbar.html';
    ?>

    <div class="title-container">
        <div class="title">
            <h1 class="oswaldMedium scaling-title-text">Recent Transactions</h1>
        </div>
        <div class="divider"></div>
    </div>
    <div class="fluid container mt-5">
        <h1>Account Balance: </h1><br />
        <h1 class="oswaldMedium scaling-title-text">£1101.65</h1>
        <div class="divider mt-5"></div>
        <div class="row justify confirmation-btns mt-5">
            <div class="col-6">
                <div class="row">
                    <div class="col">
                        <button class="btn btn-secondary payment-form-btn me-2" onclick="goBack()">In</button>
                    </div>
                    <div class="col">
                        <button class="btn btn-secondary payment-form-btn">Out</button>
                    </div>
                </div>
            </div>
            <div class="col-6 d-flex justify-content-end align-items-center">
                <nav class="navbar  border-bottom border-body" data-bs-theme="dark">
                    <div class="container-fluid">
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" style="height: 80px">
                            <button class="btn btn-outline-light" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
            </div>
        </div>
        <div class="payment-form-box mt-4">
            <div class="display-unit" id="ce">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Red Fuel Services -£10</h3>
            </div>

            <div class="display-unit" id="wm">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion -£10</h3>
            </div>

            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion -£10</h3>
            </div>
            <div class="display-unit" id="person">
                <h3 class="mb-5 text-center"><img src="icons/person.png" alt="User Icon" class="payee-icon me-3">Naomi S -£10</h3>
            </div>
            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion -£10</h3>
            </div>
            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/person.png" alt="User Icon" class="payee-icon me-3">Ananya B -£20</h3>
            </div>
            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion -£10</h3>
            </div>
            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3">Carbon Heavy Fashion -£10</h3>
            </div>
            <div class="display-unit" id="sp">
                <h3 class="mb-5 text-center"><img src="icons/person.png" alt="User Icon" class="payee-icon me-3">Ross F -£15</h3>
            </div>
        </div>

        <!-- Pop-up modal to show transaction details -->
        <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 80%; min-height: 100%">
                <div class="modal-content" style="background-color: rgb(43, 48, 53);">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transactionModalLabel">Transaction details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            <h4>Redfuel Services - £10.00</h4>
                            <p>Wed 18 Sept 2024</p>
                        </div>
                        <div class="score">
                            <div class="score-item bg-danger mt-3 text-center">Carbon emissions: 3/10</div>
                            <div class="score-item bg-warning mt-3 text-center">Waste management: 4/10</div>
                            <div class="score-item bg-danger mt-3 text-center">Sustainability practices: 2/10</div>
                        </div>

                        <div id="altCompanies" class="carousel slide my-5">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <div class="card green-score-card">
                                        <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
                                            <h5 class="text-center">Alternative Company 1</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="card green-score-card">
                                        <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
                                            <h5 class="text-center">Alternative Company 2</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="card green-score-card">
                                        <div class="card-body d-flex flex-column justify-content-between" style="height: 100%;">
                                            <h5 class="text-center">Alternative Company 3</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#altCompanies" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#altCompanies" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.querySelectorAll('.display-unit').forEach(unit => {
        unit.addEventListener('click', function() {
            var showDetailsModal = new bootstrap.Modal(document.getElementById('transactionModal'));
            showDetailsModal.show();
        });
    });

    // Resetting the carousel to its first frame
    document.getElementById('transactionModal').addEventListener('shown.bs.modal', function() {
        var carousel = document.querySelector('#altCompanies');
        var carouselInstance = new bootstrap.Carousel(carousel);
        carouselInstance.to(0);
    });
</script>

</html>