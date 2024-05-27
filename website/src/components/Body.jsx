import { useState, useEffect } from "react";
import Recipe from "./Recipe";
import RecipeCard from "./RecipeCard";
import { useResolvedPath } from "react-router-dom";

const Body = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const { pathname } = useResolvedPath();

    const api = "https://api.chris-sa.com/recipes";

    useEffect(() => {
        if (pathname !== "/") {
            fetch(api + pathname)
                .then((response) => response.json())
                .then((data) => setSelectedRecipe(data))
                .catch((err) => console.log(err));
        }

        fetch(api)
            .then((response) => response.json())
            .then((data) => setRecipes(data))
            .catch((err) => console.log(err));
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
                    />
                ))
            )}
        </main>
    );
};

export default Body;
