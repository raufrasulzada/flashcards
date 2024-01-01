# Flash Cards App

Welcome to the Flash Cards App! This application allows you to create, manage, and study flashcards.

## Getting Started

Follow the instructions below to set up and run the React app along with the JSON-Server.

### Prerequisites

Make sure you have the following installed on your machine:

- Web browser (Google Chrome, Opera, etc.)
- IDE (e.g., Visual Studio Code)
- Node.js and npm

### Clone the Repository

```bash
git clone https://github.com/raufrasulzada/flashcards.git
cd flashcards
```

### Required Dependencies

- npm install -g json-server
- npm install react-router-dom@latest

## Make sure that in scripts of package.json, you have "json-server": "json-server public/data/db.json --port 3000".

### Start the Application

To start the application, you have to first run the json server in one terminal, and then start the react application in another terminal:

- npm run json-server
- npm start

## Usage

- Link to hosted GitHub page: https://raufrasulzada.github.io/flashcards.
- Access the Flash Cards App in your browser at http://localhost:3001/flashcards.
- Utilizing the Add Card button, you can add new cards through adding front (question) and back (answer) details of cards.
- You can delete any card by simply hovering over them and clicking on the delete button.
- You can edit the cards by simply hovering over them and clicking on the edit button. When you click on the button, you will see two fields for updating the question and answer.
- Study flash cards with the provided features. By clicking on Update Status, you can update the card status to "Noted" and "Learned".
- Using the search box, you can search over the cards. The searching can be done using question and answer text.
- Using the filtering, you can display particular cards with the selected status, including "All", "Want to Learn", "Noted", and "Learned".
- Using the sorting, you can display cards based on ID, Question, Answer, Order, and Last Modification date.
- When you mark at least one of the checkboxes, share button will appear so that you can send the details of cards over e-mail in json format.
- You can change the orders of cards by changing the sorting to Order. Then you will be able to re-order cards by simply dragging one and dropping it to another card.
