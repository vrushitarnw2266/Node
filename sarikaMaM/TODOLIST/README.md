# TODO List App

This is a simple TODO list application built with Node.js, Express, and EJS. It allows users to manage their tasks with features like adding, editing, and deleting TODO items. The app uses MongoDB for data storage and includes user authentication.

## Features

- Add new TODO items
- Edit existing TODO items
- Delete TODO items
- View all TODO items
- User authentication and management
- File upload support
- Secure with Helmet middleware

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **EJS**: Templating engine
- **Multer**: Middleware for handling file uploads
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management
- **Nodemon**: Development tool for auto-restarting

## Folder Structure

```
.
├── package.json
├── server.js
├── controller/
│   └── userController.model.js
├── middleware/
│   └── userMiddleware.model.js
├── models/
│   └── userModel.model.js
├── public/
│   └── uploads/
├── routes/
│   └── userRouter.model.js
└── views/
    └── todos/
        ├── add.ejs
        ├── edit.ejs
        ├── index.ejs
        └── style.css
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd todolist
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables, e.g.:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/todolist
   ```

4. Start the application:
   - For production: `npm start`
   - For development: `npm run dev`

## Usage

- Open your browser and navigate to `http://localhost:3000` (or the port specified in your `.env`).
- Register or log in as a user.
- Add, edit, or delete your TODO items.
- Upload files if needed.

## Scripts

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode with auto-restart.

## License

ISC

## Author

vrushita panchal

