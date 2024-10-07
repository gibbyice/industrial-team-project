<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>FAQ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/style.css">
  </head>
  <body>
    <?php
      require 'navbar.html'
    ?>

    <div class="title-container">
      <div class="title">
          <h1 class="oswaldMedium scaling-title-text">FAQ</h1>
      </div>
      <div class="divider"></div>
    </div>

    <div class="questions-container">
      <div class="q&a scaling-body-text">
        <ul>
          <li>Q: How do we calculate our ratings for companies?</li>
          <li>A: Through an extensive dataset which gives ratings for a given company, these consist of: Carbon emissions, waste management and sustainability practices. Given we strive for transparency we display this to you in it's raw format and then combine these ratings to calculate how good a given company is.</li>
          <li>Q: How do we calculate the XP we give out?</li>
          <li>A: We use a multiplier, the formula for which is: "M = 0.5 + (1.5 * g)" where g is 'green score' which is the sum of the 3 values in our dataset. This allows us to give out XP based on your purchasing habits, if you opt to spend money at a low rated company you will recieve less XP than if you spent that same money at highly rated company.</li>
        </ul>
      </div>
    </div>

    <div class="manual-spacer" style="height: 170px;"></div> <!-- non-elegant solution to not having content hidden behind the navbar :) but if it's stupid but works it ain't stupid -->
  </body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html>
