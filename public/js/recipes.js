document.addEventListener('DOMContentLoaded', () => {
    const recipeCards = document.getElementById('recipeCards');
    const recipeForm = document.getElementById('recipeForm');
    const categorySelect = document.querySelector('select[name="categoryId"]');

    // Check if a recipe was just deleted
    const deletedRecipeId = localStorage.getItem('deletedRecipeId');
    if (deletedRecipeId) {
        localStorage.removeItem('deletedRecipeId');
        showSuccessToast('Recipe deleted successfully');
    }

    // Comprehensive error handling utility
    function handleError(context, error) {
        console.error(`Error in ${context}:`, error);
        
        // Optional: Display user-friendly error message
        const errorToast = document.createElement('div');
        errorToast.classList.add('toast', 'show', 'position-fixed', 'top-0', 'end-0', 'm-3', 'bg-danger', 'text-white');
        errorToast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${context}: ${error.message || 'An unexpected error occurred'}
            </div>
        `;
        document.body.appendChild(errorToast);
    }

    // Fetch and populate categories with advanced error handling
    async function fetchCategories() {
        try {
            const response = await fetch('/recipes/categories', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Check response status
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const categories = await response.json();
            
            console.log('Fetched Categories:', categories);
            
            // Clear existing options
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            
            // Validate and populate categories
            if (Array.isArray(categories) && categories.length > 0) {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            } else {
                throw new Error('No categories found');
            }
        } catch (error) {
            handleError('Fetching Categories', error);
        }
    }

    // Fetch and display recipes with comprehensive error handling
    async function fetchRecipes() {
        try {
            const response = await fetch('/recipes', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const recipes = await response.json();
            
            console.log('Fetched recipes:', recipes);
            
            // Clear existing cards
            recipeCards.innerHTML = '';
            
            // Validate recipes
            if (Array.isArray(recipes) && recipes.length > 0) {
                // Filter out the deleted recipe
                const filteredRecipes = deletedRecipeId 
                    ? recipes.filter(recipe => recipe.id !== parseInt(deletedRecipeId))
                    : recipes;

                filteredRecipes.forEach(recipe => {
                    const safeTitle = escapeHTML(recipe.title);
                    const safeCategory = escapeHTML(recipe.Category?.name || 'Uncategorized');
                    
                    const cardHTML = `
                        <div class="col-md-4">
                            <div class="card recipe-card shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${safeTitle}</h5>
                                    <p class="card-text">Category: ${safeCategory}</p>
                                    <button class="btn btn-primary" onclick="viewRecipeDetails(${recipe.id})">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    recipeCards.innerHTML += cardHTML;
                });

                // If no recipes left after filtering
                if (filteredRecipes.length === 0) {
                    recipeCards.innerHTML = `
                        <div class="col-12 text-center">
                            <p>No recipes found. Start adding some!</p>
                        </div>
                    `;
                }
            } else {
                recipeCards.innerHTML = `
                    <div class="col-12 text-center">
                        <p>No recipes found. Start adding some!</p>
                    </div>
                `;
            }
        } catch (error) {
            handleError('Fetching Recipes', error);
        }
    }


    // Submit new recipe with validation and error handling
    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form validation
        if (!validateRecipeForm(e.target)) {
            return;
        }
        
        const formData = {
            title: e.target.title.value.trim(),
            categoryId: e.target.categoryId.value,
            ingredients: e.target.ingredients.value.trim(),
            instructions: e.target.instructions.value.trim()
        };

        try {
            const response = await fetch('/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Recipe added:', result);
            
            // Success handling
            const modal = bootstrap.Modal.getInstance(document.getElementById('addRecipeModal'));
            modal.hide();
            
            // Reset form
            recipeForm.reset();
            
            // Refresh recipes
            fetchRecipes();
            
            // Optional: Show success toast
            showSuccessToast('Recipe added successfully!');
        } catch (error) {
            handleError('Submitting Recipe', error);
        }
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    // Form validation function
    function validateRecipeForm(form) {
        const title = form.title.value.trim();
        const categoryId = form.categoryId.value;
        const ingredients = form.ingredients.value.trim();
        const instructions = form.instructions.value.trim();

        if (!title || !categoryId || !ingredients || !instructions) {
            alert('Please fill in all fields');
            return false;
        }
        return true;
    }

    // HTML escaping function to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
    }

    // Success toast function
    function showSuccessToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.innerHTML = `
            <div class="toast show position-fixed top-0 end-0 m-3 bg-success text-white">
                <div class="toast-body">${message}</div>
            </div>
        `;
        document.body.appendChild(toastContainer);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }

    // Initial load
    fetchCategories();
    fetchRecipes();
});

// Placeholder for future recipe details view
function viewRecipeDetails(recipeId) {
    window.location.href = `/recipe-details?id=${recipeId}`;
}