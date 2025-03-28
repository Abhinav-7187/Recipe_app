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

            // Share the recipe-details through whatsapp
const whatsappShareBtn = document.getElementById('whatsappShareBtn');

if (whatsappShareBtn) {
    whatsappShareBtn.addEventListener('click', () => {
        const shareText = `
Recipe: ${recipe.title}

Ingredients:
${recipe.ingredients}

Instructions:
${recipe.instructions}

Category: ${recipe.Category.name}
        `;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });
}
        } catch (error) {
            recipeDetailsContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error fetching recipe details: ${error.message}
                </div>
            `;
        }
    }

    // Delete recipe functionality
    if (deleteRecipeBtn && recipeId) {
        deleteRecipeBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/recipes/${recipeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
    
                console.log('Response status:', response.status);
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(result.message || 'Failed to delete recipe');
                }

                const result = await response.json();
                console.log('Delete response:', result);
    
                // Store deleted recipe ID
                localStorage.setItem('deletedRecipeId', recipeId);
                
                // Redirect to recipes dashboard
                window.location.href = '/recipes';
            } catch (error) {
                console.error('Error deleting recipe:', error);
                alert(error.message || 'Failed to delete recipe');
            }
        });
    }

    if (recipeId) {
        fetchRecipeDetails();
    }
});