document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const searchButton = document.getElementById('button');
    const easyProgressCircle = document.getElementById('dabba1');
    const mediumProgressCircle = document.getElementById('dabba2');
    const hardProgressCircle = document.getElementById('dabba3');
    const cardContainer = document.getElementById('card-container'); // use id now
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');

    function validateUsername(username) {
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}[a-zA-Z0-9]$/;
        if (!regex.test(username)) {
            alert("Invalid username!");
            return false;
        }
        return true;
    }

    async function fetchUserDetail(username) {
        try {
            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;

            const response = await fetch('http://localhost:5000/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            console.log(response.status);
            if (!response.ok) {
                throw new Error("Unable to fetch data");
            }

            const parsedData = await response.json();
            console.log(parsedData);
            displayUserData(parsedData);
        } catch (error) {
            console.log(error);
            alert("Error fetching data");
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = 'Search';
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressPercent = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressPercent}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        // Update progress circles
        updateProgress(parsedData.easySolved, parsedData.totalEasy, easyLabel, easyProgressCircle);
        updateProgress(parsedData.mediumSolved, parsedData.totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(parsedData.hardSolved, parsedData.totalHard, hardLabel, hardProgressCircle);

        // Update cards
        const cardData = [
            { label: "Overall Submissions", value: parsedData.totalSolved },
            { label: "Rank", value: parsedData.ranking },
            { label: "Acceptance Rate", value: parsedData.acceptanceRate },
            { label: "Contribution", value: parsedData.contributionPoints }
        ];

        cardContainer.innerHTML = cardData.map(data => `
            <div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>
        `
        )
        .join('');
        cardContainer.style.cssText="background-color:yellow display:flex flex-wrap:wrap;"
    }
cardContainer.style.cssText="background-color:yellow display:flex flex-wrap:wrap;"


    searchButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        console.log(username);
        if (validateUsername(username)) {
            console.log("Valid username");
            fetchUserDetail(username);
        } else {
            console.log("Invalid username");
        }
    });
});
