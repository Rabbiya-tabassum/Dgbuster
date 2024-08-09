let isBruteforcing = false;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Example CORS proxy

async function startBruteforce() {
    const url = document.getElementById('urlInput').value.trim();
    const wordlist = await fetch('wordlist.txt').then(response => response.text());
    const paths = wordlist.split('\n').filter(path => path.trim() !== '');
    const resultsDiv = document.getElementById('results');
    const stopButton = document.getElementById('stopButton');

    isBruteforcing = true;
    stopButton.disabled = false;
    resultsDiv.innerHTML = `<p>Bruteforcing <strong>${url}</strong>...</p>`;
    
    // Ensure resultsDiv remains scrolled to bottom
    resultsDiv.style.overflowY = "auto";

    for (const path of paths) {
        if (!isBruteforcing) break;

        try {
            const response = await fetch(`${proxyUrl}${url}/${path}`);
            const statusCode = response.status;

            if (response.ok) {
                resultsDiv.innerHTML += `<p><strong>Found:</strong> ${url}/${path} - Status Code: ${statusCode}</p>`;
            } else {
                resultsDiv.innerHTML += `<p>Failed to access ${url}/${path} - Status Code: ${statusCode}</p>`;
            }

        } catch (error) {
            resultsDiv.innerHTML += `<p>Error accessing ${url}/${path} - Possibly blocked by CORS</p>`;
        }

        // Auto scroll to keep the latest results in view
        resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    if (isBruteforcing) {
        resultsDiv.innerHTML += `<p>Bruteforcing complete.</p>`;
    } else {
        resultsDiv.innerHTML += `<p>Bruteforcing stopped.</p>`;
    }

    stopButton.disabled = true;
}

function stopBruteforce() {
    isBruteforcing = false;
}
