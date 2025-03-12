const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require('./config/database');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const Recipe = require('./models/recipe');
const Category = require('./models/category');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to handle routes
app.use((req, res, next) => {
  // Check if it's an API request
  if (req.path.startsWith('/recipes') && req.headers['accept'] !== 'application/json') {
    return res.sendFile(__dirname + '/views/recipes.html');
  }
  next();
});


// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});


/*// Serve HTML page with recipe UI
app.get('/recipes', (req, res) => {
  res.sendFile(__dirname + '/views/recipes.html');
});*/

// Serve HTML page for recipes
app.get('/recipes-page', (req, res) => {
  res.sendFile(__dirname + '/views/recipes.html');
});

app.get('/recipe-details', (req, res) => {
  res.sendFile(__dirname + '/views/recipe-details.html');
});



// Function to initialize categories
async function initializeCategories() {
  try {
    const categoriesCount = await Category.count();
    if (categoriesCount === 0) {
      await Category.bulkCreate([
        { name: 'Breakfast' },
        { name: 'Lunch' },
        { name: 'Dinner' },
        { name: 'Dessert' },
        { name: 'Snacks' }
      ]);
      console.log('Categories initialized');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
}

// Database sync
sequelize.sync()
  .then(() => {
    console.log('Database connected');
    return initializeCategories();  // Call the function
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Database connection error:', err));