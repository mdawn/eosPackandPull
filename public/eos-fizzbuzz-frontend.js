function updateMostRecentBlock(newText) {
  console.log(`updating block with ${newText}`);
  document.getElementById('recent-block').innerHTML = newText;
}

function getRecentBlockAndUpdatePage() {
  fetch('http://localhost:3000/show').then(function(response) {
    return response.json();
  }).then(function(myJson) {
    updateMostRecentBlock(JSON.stringify(myJson));
  });
}

document.getElementById('latest-block-button').onclick = getRecentBlockAndUpdatePage;
