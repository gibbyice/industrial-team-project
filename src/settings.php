<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Settings</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
  </head>
  <body>
    <?php
      require 'navbar.html'
    ?>

    <div class="title-container">
      <div class="title">
          <h1 class="oswaldMedium scaling-title-text">Settings</h1>
      </div>
      <div class="divider"></div>
    </div>

    <div class="body-container">
      <div class="buttons">
        <div class="d-grid gap-2">
          <button class="btn btn-outline-light dynamic-button" type="button" onclick="window.location.href='faq.php';">FAQ</button>
          <button class="btn btn-outline-light dynamic-button" type="button">Log out</button>
        </div>
      </div>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div> <!-- non-elegant solution to not having content hidden behind the navbar :) but if it's stupid but works it ain't stupid -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>
