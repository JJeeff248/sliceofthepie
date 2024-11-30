import { useState, useEffect } from "react";
import Recipe from "./Recipe";
import RecipeCard from "./RecipeCard";
import { useResolvedPath } from "react-router-dom";
import CreateRecipe from "./CreateRecipe";

const Body = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const { pathname } = useResolvedPath();

    const api = "https://api.chris-sa.com/recipes";

    useEffect(() => {
        if (pathname !== "/" && pathname !== "/create") {
            fetch(api + pathname)
                .then((response) => response.json())
                .then((data) =>
                    setSelectedRecipe(
                        data.recipeID === pathname.slice(1) ? data : ErrorRecipe
                    )
                )
                .catch((err) => console.log(err));
        }

        fetch(api)
            .then((response) => response.json())
            .then((data) => setRecipes(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <main>
            {pathname === "/create" ? (
                <CreateRecipe setCreateRecipeOpen={() => {}} />
            ) : selectedRecipe ? (
                <Recipe
                    recipe={selectedRecipe}
                    setSelectedRecipe={setSelectedRecipe}
                />
            ) : (
                recipes.map((recipe) => (
                    <RecipeCard key={recipe.recipeID} recipe={recipe} />
                ))
            )}
        </main>
    );
};

const ErrorRecipe = {
    name: "We couldn't find that recipe",
    description:
        "Sorry, we couldn't find that recipe. Check the URL and try again.",
    recipeID: "error",
};

export default Body;
