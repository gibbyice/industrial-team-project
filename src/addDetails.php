<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Add payment details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
    <?php
        require 'navbar.html';
    ?>

    <div class="title-container">
      <div class="title">
          <h1 class="oswaldMedium scaling-title-text" id="payee-id">Add payment details</h1>
      </div>
      <div class="divider"></div>
    </div>

    <div id="payment-form" class="payment-form-container">
        <div class="payment-form-box">
            <h3>To: <img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3"><strong><?php echo $_GET['payeeName']; ?></strong></h3>
            <form action="#" onsubmit="showConfirmation(); return false;">
                <div class="mb-3">
                  <label for="amount" class="form-label">Amount:</label>
                  <input type="number" class="form-control" id="amount" name="amount" placeholder="£0.00" min="0.01" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label for="reference" class="form-label">Reference:</label>
                    <input type="text" class="form-control" id="reference" name="reference" placeholder="e.g., New computer hardware" required>
                </div>
                <button type="submit" class="btn btn-success payment-form-btn">Continue</button>
            </form>
        </div>
    </div>

    <div id="confirmation" class="payment-form-container hidden">
        <div class="payment-form-box">
            <h3>From: <img src="icons/person.png" alt="User Icon" class="payee-icon me-3"><strong>Ross F</strong></h3>
            <h3>To: <img src="icons/business.png" alt="Payee Icon" class="payee-icon me-3"><strong><?php echo $_GET['payeeName']; ?></strong></h3>
            <div class="confirm-details">
              <h3> Amount: <strong id="confirm-amount">£0.00</strong><br></h3>
              <h3> Reference: <strong id="confirm-reference">None</strong></h3>
            </div>
            <div class="d-flex confirmation-btns">
                <button class="btn btn-secondary payment-form-btn" onclick="editDetails()">Edit</button>
                <button class="btn btn-success payment-form-btn" onclick="makeTransaction()">Confirm</button>
            </div>
        </div>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../scripts/payment.js"></script>
</body>
</html>
