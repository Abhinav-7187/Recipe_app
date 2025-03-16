const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Category = require('../models/category');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      raw: true,  // Converts to plain object
      attributes: ['id', 'name']  // Explicitly select these fields
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching categories', 
      error: error.message 
    });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [Category],
      raw: true,  // Convert to plain objects
      nest: true  // Properly nest included models
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recipes', 
      error: error.message 
    });
  }
});

// Create new recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions, categoryId } = req.body;

    console.log('Received recipe data:', req.body);
    
    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      CategoryId: categoryId
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Detailed recipe creation error:', error);
    res.status(500).json({ 
      message: 'Error creating recipe', 
      error: error.message,
      stack: error.stack
    });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [Category]
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recipe', 
      error: error.message 
    });
  }
});

// Delete recipe by ID
router.delete('/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    
    console.log('Attempting to delete recipe ID:', recipeId);

    // Explicitly check if recipe exists before deletion
    const existingRecipe = await Recipe.findByPk(recipeId);
    
    if (!existingRecipe) {
      console.log('Recipe not found');
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Perform deletion
    const deletedCount = await Recipe.destroy({
      where: { id: recipeId }
    });

    console.log('Deletion result:', deletedCount);

    if (deletedCount > 0) {
      res.status(200).json({ 
        message: 'Recipe deleted successfully', 
        recipeId: recipeId 
      });
    } else {
      console.log('No rows deleted');
      res.status(400).json({ message: 'Failed to delete recipe' });
    }
  } catch (error) {
    console.error('Detailed deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting recipe', 
      error: error.message 
    });
  }
});


module.exports = router;