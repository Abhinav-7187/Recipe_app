document.addEventListener('DOMContentLoaded', () => {
    const recipeDetailsContainer = document.getElementById('recipeDetailsContainer');
    
    // Extract recipe ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    async function fetchRecipeDetails() {
        try {
            const response = await fetch(`/recipes/${recipeId}`,{
                headers: {
                  'Accept': 'application/json'
                }
              });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const recipe = await response.json();
            
            recipeDetailsContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h2>${recipe.title}</h2>
                    </div>
                    <div class="card-body">
                        <h4><i class="fas fa-tag me-2"></i>Category</h4>
                        <p>${recipe.Category.name}</p>
                        
                        <h4><i class="fas fa-list me-2"></i>Ingredients</h4>
                        <p>${recipe.ingredients}</p>
                        
                        <h4><i class="fas fa-utensils me-2"></i>Instructions</h4>
                        <p>${recipe.instructions}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            recipeDetailsContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error fetching recipe details: ${error.message}
                </div>
            `;
        }
    }

    if (recipeId) {
        fetchRecipeDetails();
    }
});