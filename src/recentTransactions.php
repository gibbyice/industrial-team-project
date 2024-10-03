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
        <h1 class="oswaldMedium scaling-title-text" id="balance"></h1>
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
        <div class="payment-form-box mt-4" id = "transaction-list">
        </div>

        <!-- Pop-up modal to show transaction details -->
        <div id='modal-container'>
        </div>
    </div>

</body>
<script src="../scripts/RecentTransactions.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
<script>

    // Resetting the carousel to its first frame
    
</script>

</html>