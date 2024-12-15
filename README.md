# Binary Tree Visualizer

This project is a web-based application that allows users to visualize binary trees. Users can input a list of numbers, which will be sent to a backend server to create a binary tree. The tree is then visualized in a new window using D3.js.

## Features

- Input numbers to create a binary tree
- Visualize the binary tree in a new window
- Display the tree as a list, table, or SVG diagram
- Color-coded nodes for better visualization

## Technologies Used

- HTML
- CSS
- JavaScript
- D3.js

## Getting Started

### Prerequisites

- A web browser
- A backend server running at `http://localhost:8080` that accepts POST requests to `/api/tree` and returns a binary tree in JSON format

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/binary-tree-visualizer.git
    ```
2. Navigate to the project directory:
    ```sh
    cd binary-tree-visualizer
    ```

### Usage

1. Open [index.html](http://_vscodecontentref_/0) in your web browser.
2. Enter a list of numbers separated by commas in the input field.
3. Click the "Create Binary Tree" button.
4. A new window will open displaying the binary tree visualization.

### Example

1. Enter numbers: `10, 5, 20, 3, 7, 15, 30`
2. Click "Create Binary Tree"
3. A new window will open showing the binary tree with nodes and links.

## Project Structure


### [index.html](http://_vscodecontentref_/1)

The main HTML file that contains the form for inputting numbers and a container for the tree visualization.

### [styles.css](http://_vscodecontentref_/2)

The CSS file that styles the form, container, and other elements.

### [script.js](http://_vscodecontentref_/3)

The JavaScript file that handles form submission, sends data to the backend, and visualizes the binary tree using D3.js.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [D3.js](https://d3js.org/) for the powerful data visualization library
- [MDN Web Docs](https://developer.mozilla.org/) for the excellent documentation and resources

## Contact

Your Name - Steve Sharpe

Project Link: https://github.com/steve-sharpe/DSA-Sprint-HTML
