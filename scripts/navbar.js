document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();

  const pageButtonMap = {
    'index.php': document.getElementById('home-btn'),
    'pay.php': document.getElementById('pay-btn'),
    'greenScore.php': document.getElementById('green-score-btn'),
    'settings.php': document.getElementById('settings-btn'),
    'addNewPayee.php': document.getElementById('new-payee-btn')
  };

  if (pageButtonMap[currentPage]) {
    pageButtonMap[currentPage].classList.add('active-btn');
  } else {
    console.log("no page found"); // this should never log, any page that navbar is on, will use the navbar for navigation :)
  }
});
