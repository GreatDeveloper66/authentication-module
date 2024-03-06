import { config } from 'dotenv';
config();
import express from 'express';
import { connect } from 'mongoose';
import session from 'express-session';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;

const MONGO_DATABASE_URI = `mongodb+srv://${username}:${password}@${cluster}/test?retryWrites=true&w=majority`;


connect(MONGO_DATABASE_URI)
    .then(() => console.log('Connected to database'))
    .catch(error => console.log(error));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));    

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Other imports and setup code

// Serve static files from the 'client/build' directory
app.use(express.static(join(__dirname, 'client', 'build')));

// Define a catch-all route to serve the React app's HTML file
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
