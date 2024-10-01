<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">

</head>

    <body>

        <div class="title-container">
            <div class="title">
                <h1 class="company-title scaling-title-text mb-0">Pay-Per Trail <img class = "mb-4 scaling-logo" src="icons/logo.png" alt="company logo" width="200" height="200" class="mb-3"></h1>
            </div>
            <div class="divider"></div>
        </div>

        <!-- There was no point in duplicating a lot of the css so i have just used classes from ADD PYMT DETAILS STYLING -->
        <div class="parent container d-flex align-items-center">
            <div class="col-12">

                <!-- Login -->
                <div class="row justify-content-center">
                    <div class="payment-form-box">
                        <h3 class="me-3"><strong>Login</strong></h3>
                        <form action="#" id="loginForm" onsubmit="login(); return false;">
                            <div class="mt-3">
                                <input type="text" class="form-control" id="loginAccNum" name="loginAccNum" placeholder="Enter your account number" required>
                                <div class="alert alert-danger mt-1 d-none" id="loginError">
                                    <h3 class="my-0">No account exists matching provided account number.</h3>
                                </div>
                            </div>
                            <div class="d-flex confirmation-btns mt-4">
                                <button class="btn btn-success payment-form-btn">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Spacing -->
                <div class="middle-divider row">
                    <hr class="mt-2 divider col">
                    <h3 class="m-0 col-2 text-center"><strong>OR</strong></h3>
                    <hr class="mt-2 divider col">
                </div>

                <!-- Register -->
                <div class="row justify-content-center">
                    <div class="payment-form-box">
                        <h3 class="me-3"><strong>Register</strong></h3>
                        <form action="#" id="regForm" onsubmit="register(); return false;">
                            <div class="mt-3">
                                <input type="text" class="form-control" id="regAccName" name="regAccName" placeholder="Enter a username" required>
                                <h3 class="my-0 alert alert-danger mt-1 d-none" id="RegisterError">Please make sure your name's length is between 2 & 255 (inclusive)</h3>
                                <h3 class="my-0 alert alert-success mt-1 d-none" id="RegisterSuccess">Account added successfully, your ID is: .</h3>
                            </div>
                            <div class="d-flex confirmation-btns mt-4">
                                <button class="btn btn-success payment-form-btn">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>


        </div>
    </body>
</html>

<script src="../scripts/loginPage.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
