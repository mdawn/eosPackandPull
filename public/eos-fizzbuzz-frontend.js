function updateMostRecentBlock(newText) {
  console.log(`updating block with ${newText}`);
  document.getElementById('recent-block').innerHTML = newText;
}

function updatePulledBlock(newText) {
  document.getElementById('pulled-block').innerHTML = newText;
}

function getRecentBlockAndUpdatePage() {
  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
      lastBlock {
        id
        timestamp
        txn_count
        block_num
      }
    }`,
      variables: true,
      operationName: true
    }),
    credentials: 'include'
  }).then(function(response) {
    return response.text();
  }).then(function(responseBody) {
    try {
      updateMostRecentBlock(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
}

function getPulledBlockAndUpdatePage() {
  var blockID = document.querySelector('input').value;
  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
   blocks(numbers: [${blockID}]){
     id
     timestamp
     txn_count
     block_num
   }
 }
`,
      variables: true,
      operationName: true
    }),
    credentials: 'include'
  }).then(function(response) {
    return response.text();
  }).then(function(responseBody) {
    try {
      updatePulledBlock(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
}

document.getElementById('latest-block-button').onclick = getRecentBlockAndUpdatePage;
document.getElementById('pulled-block-button').onclick = getPulledBlockAndUpdatePage;
