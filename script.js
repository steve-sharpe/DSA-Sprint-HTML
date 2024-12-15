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
        openVisualizationWindow(treeData);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Check the console for details.");
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


function displayTreeAsTable(treeData) {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "20px auto";
    table.style.width = "80%";

    // Add table headers
    const headerRow = table.insertRow();
    ["Node Value", "Left Child", "Right Child"].forEach(header => {
        const cell = document.createElement("th");
        cell.textContent = header;
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "10px";
        headerRow.appendChild(cell);
    });

    // Recursively populate table rows
    function addRows(node) {
        if (!node) return;

        const row = table.insertRow();
        const valueCell = row.insertCell();
        const leftCell = row.insertCell();
        const rightCell = row.insertCell();

        valueCell.textContent = node.value || "N/A";
        valueCell.style.border = "1px solid #ccc";
        valueCell.style.padding = "10px";
        leftCell.textContent = node.left ? node.left.value : "None";
        leftCell.style.border = "1px solid #ccc";
        leftCell.style.padding = "10px";
        rightCell.textContent = node.right ? node.right.value : "None";
        rightCell.style.border = "1px solid #ccc";
        rightCell.style.padding = "10px";

        // Add rows for children
        addRows(node.left);
        addRows(node.right);
    }

    addRows(treeData);

    // Clear previous content and add the table
    const container = document.getElementById("treeVisualization");
    container.innerHTML = ""; // Clear previous content
    container.appendChild(table);
}

// Call this function with the tree data
displayTreeAsTable(treeData);

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

// Call this function with the tree data
displayTreeAsList(treeData);


function visualizeTree(treeData) {
    const width = 800;
    const height = 600;

    const svg = d3.select("#treeVisualization").html("") // Clear existing content
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const treeLayout = d3.tree().size([width - 200, height - 200]);

    // Convert the treeData into a hierarchy
    const root = d3.hierarchy(treeData);

    // Apply the tree layout
    treeLayout(root);

    // Debugging: Log root hierarchy
    console.log("Hierarchy root:", root);

    // Draw links
    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .classed("link", true)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .attr("stroke", "#555")
        .attr("fill", "none");

    // Draw nodes
    const nodes = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .classed("node", true)
        .attr("transform", d => `translate(${d.y}, ${d.x})`);

    nodes.append("circle")
        .attr("r", 10)
        .attr("fill", "#007BFF")
        .attr("stroke", "#fff")
        .attr("stroke-width", 3);

    nodes.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -12 : 12)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.value);
}
