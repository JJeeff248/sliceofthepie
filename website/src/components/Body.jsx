import { useState, useEffect } from "react";
import Recipe from "./Recipe";
import RecipeCard from "./RecipeCard";

const Body = () => {

    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const api = "https://api.chris-sa.com/recipes";

    useEffect(() => {
        fetch(api)
            .then(response => response.json())
            .then(data => setRecipes(data))
    }, []);

    return (
        <main>
            {selectedRecipe ? (
                <Recipe recipe={selectedRecipe} setSelectedRecipe={setSelectedRecipe} />
            ) : (
                recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.recipeID}
                        recipe={recipe}
                        setSelectedRecipe={setSelectedRecipe}
                    />
                ))
            )}
                    
        </main>
    )
}

export default Body;