# BookStore MVC Application

A simple Book Store application built with Node.js, Express, EJS, and MongoDB using the MVC pattern.

## Features

- MVC-based project structure
- MongoDB connection with Mongoose
- Create, read, update, and delete books
- EJS views for server-rendered pages
- Environment-based configuration with `dotenv`
- Basic error handling and clean routing

## Project Structure

```text
BOOKSTORE/
|-- src/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   `-- bookController.js
|   |-- middlewares/
|   |   |-- errorHandler.js
|   |   `-- notFound.js
|   |-- models/
|   |   `-- Book.js
|   |-- public/
|   |   `-- css/
|   |       `-- styles.css
|   |-- routes/
|   |   `-- bookRoutes.js
|   |-- views/
|   |   |-- books/
|   |   |   |-- create.ejs
|   |   |   |-- edit.ejs
|   |   |   `-- index.ejs
|   |   |-- partials/
|   |   |   |-- footer.ejs
|   |   |   `-- header.ejs
|   |   |-- 404.ejs
|   |   `-- 500.ejs
|   `-- app.js
|-- .env.example
|-- package.json
|-- README.md
`-- server.js
```

## MVC Explanation

- Model: [src/models/Book.js](/v:/Study/Node/sarikaMaM/BOOKSTORE/src/models/Book.js) defines the book schema and talks to MongoDB.
- View: [src/views/books/index.ejs](/v:/Study/Node/sarikaMaM/BOOKSTORE/src/views/books/index.ejs) and the other EJS files render the UI.
- Controller: [src/controllers/bookController.js](/v:/Study/Node/sarikaMaM/BOOKSTORE/src/controllers/bookController.js) handles request logic and connects models with views.
- Route: [src/routes/bookRoutes.js](/v:/Study/Node/sarikaMaM/BOOKSTORE/src/routes/bookRoutes.js) maps URLs to controller methods.

## MongoDB Connection

This project connects to MongoDB through Mongoose in [src/config/db.js](/v:/Study/Node/sarikaMaM/BOOKSTORE/src/config/db.js).

Use either:

- Local MongoDB:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bookstore
```

- MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookstore
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`.

3. Add your MongoDB connection string to `.env`.

4. Start the development server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000/books
```

## Main Routes

- `GET /books` - show all books
- `GET /books/create` - show add book form
- `POST /books` - create a new book
- `GET /books/:id/edit` - show edit form
- `POST /books/:id/edit` - update book
- `POST /books/:id/delete` - delete book

## Book Fields

- `title`
- `author`
- `price`
- `genre`
- `publishedYear`
- `description`
- `inStock`

## Notes

- The app uses server-side rendering with EJS.
- `npm start` runs the app with Node.
- `npm run dev` runs the app with Nodemon.
