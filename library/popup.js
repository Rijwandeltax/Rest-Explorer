document.getElementById('exploreApi').addEventListener('click', function() {
    let accessToken = document.getElementById('accessToken').value;
    let apiEndpoint = document.getElementById('apiEndpoint').value;

    if (accessToken && apiEndpoint) {
        let url = 'https://rijudelta-dev-ed.my.salesforce.com' + apiEndpoint;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 4);
        })
        .catch(error => {
            document.getElementById('apiResponse').textContent = 'Error: ' + error;
        });
    } else {
        alert("Please enter both Access Token and API Endpoint");
    }
});
