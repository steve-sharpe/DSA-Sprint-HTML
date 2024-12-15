// filepath: /d:/coding/DSA-Sprint-HTML/script.js
const previousEntries = [];

document.getElementById("numberForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const numbersInput = document.getElementById("numbers").value;
    const numbers = numbersInput.split(",").map(num => parseInt(num.trim()));

    if (numbers.some(isNaN)) {
        alert("Please enter valid numbers separated by commas.");
        return;
    }

    try {
        // Send numbers to the backend to create a binary tree
        const response = await fetch("http://localhost:8080/api/tree", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(numbers), // Send the array directly
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Response body:", errorText);
            throw new Error("Failed to create binary tree");
        }

        const treeData = await response.json();
        console.log("Response body:", treeData);

        // Fetch and display previous entries
        await fetchPreviousEntries();

        openVisualizationWindow(treeData);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Check the console for details.");
    }
});

document.getElementById("togglePreviousEntries").addEventListener("click", async () => {
    const previousEntriesDiv = document.getElementById("previousEntries");
    if (previousEntriesDiv.style.display === "none" || previousEntriesDiv.style.display === "") {
        previousEntriesDiv.style.display = "block";
        document.getElementById("togglePreviousEntries").textContent = "Hide Previous Entries";
        await fetchPreviousEntries(); // Fetch and display entries when showing the div
    } else {
        previousEntriesDiv.style.display = "none";
        document.getElementById("togglePreviousEntries").textContent = "Show Previous Entries";
    }
});

async function fetchPreviousEntries() {
    try {
        const response = await fetch('http://localhost:8080/api/entries');
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Expected an array of trees');
        }

        // Open a new window
        const newWindow = window.open('entries.html', '_blank');

        // Wait for the new window to load
        newWindow.onload = () => {
            const previousEntriesDiv = newWindow.document.getElementById("previousEntries");
            previousEntriesDiv.innerHTML = ''; // Clear previous entries

            data.forEach(entry => {
                if (entry.inputNumbers) {
                    const numbers = entry.inputNumbers.split(',').map(Number);
                    console.log('Numbers:', numbers);

                    // Create a new div for each entry
                    const entryDiv = newWindow.document.createElement('div');
                    entryDiv.className = 'entry';
                    entryDiv.textContent = `Numbers: ${numbers.join(', ')}`;
                    previousEntriesDiv.appendChild(entryDiv);
                } else {
                    console.warn('Entry does not have inputNumbers:', entry);
                }
            });
        };
    } catch (error) {
        console.error('Error fetching previous trees:', error);
    }
}

document.getElementById("togglePreviousEntries").addEventListener("click", fetchPreviousEntries);
document.getElementById("togglePreviousEntries").addEventListener("click", () => {
    const previousEntriesDiv = document.getElementById("previousEntries");
    if (previousEntriesDiv.style.display === "none") {
        previousEntriesDiv.style.display = "block";
        document.getElementById("togglePreviousEntries").textContent = "Hide Previous Entries";
        fetchPreviousEntries(); // Fetch and display entries when showing the div
    } else {
        previousEntriesDiv.style.display = "none";
        document.getElementById("togglePreviousEntries").textContent = "Show Previous Entries";
    }
});

function openVisualizationWindow(treeData) {
    const newWindow = window.open("", "Binary Tree Visualization", "width=800,height=600");
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Binary Tree Visualization</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                ul { list-style-type: none; padding-left: 20px; }
                li { margin: 5px 0; padding: 5px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div id="treeVisualization"></div>
            <script>
                ${displayTreeAsList.toString()} // Embed the function directly
                const treeData = ${JSON.stringify(treeData)};
                displayTreeAsList(treeData);
            </script>
        </body>
        </html>
    `);
}

function showPreviousEntries() {
    const container = document.getElementById("previousEntries");
    container.innerHTML = ''; // Clear previous content

    fetch('http://localhost:8080/api/entries')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of entries');
            }

            data.forEach(entry => {
                if (entry.inputNumbers) {
                    const numbers = entry.inputNumbers.split(',').map(Number);
                    const entryDiv = document.createElement('div');
                    entryDiv.textContent = `Numbers: ${numbers.join(', ')}`;
                    container.appendChild(entryDiv);
                } else {
                    console.warn('Entry does not have inputNumbers:', entry);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching previous entries:', error);
        });
}

function showPreviousEntries() {
    const container = document.getElementById("previousEntries");
    container.innerHTML = ''; // Clear previous content

    fetch('http://localhost:8080/api/entries')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of entries');
            }

            data.forEach(entry => {
                if (entry.inputNumbers) {
                    const numbers = entry.inputNumbers.split(',').map(Number);
                    const entryDiv = document.createElement('div');
                    entryDiv.textContent = `Numbers: ${numbers.join(', ')}`;
                    container.appendChild(entryDiv);
                } else {
                    console.warn('Entry does not have inputNumbers:', entry);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching previous entries:', error);
        });
}

// Function to display tree as a list
function displayTreeAsList(treeData) {
    function createList(node) {
        if (!node) return null;

        const ul = document.createElement("ul");
        ul.style.listStyleType = "none";
        ul.style.paddingLeft = "20px";

        const li = document.createElement("li");
        li.textContent = `Value: ${node.value}`;
        ul.appendChild(li);

        if (node.left || node.right) {
            const childrenUl = document.createElement("ul");
            if (node.left) {
                const leftLi = document.createElement("li");
                leftLi.textContent = "Left:";
                leftLi.appendChild(createList(node.left));
                childrenUl.appendChild(leftLi);
            }
            if (node.right) {
                const rightLi = document.createElement("li");
                rightLi.textContent = "Right:";
                rightLi.appendChild(createList(node.right));
                childrenUl.appendChild(rightLi);
            }
            ul.appendChild(childrenUl);
        }

        return ul;
    }

    const container = document.getElementById("treeVisualization");
    container.innerHTML = ""; // Clear previous content
    const list = createList(treeData);
    if (list) {
        container.appendChild(list);
    }
}

// Fetch previous entries on page load
fetchPreviousEntries();