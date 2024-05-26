import PropTypes from "prop-types";
import React from "react";

import "./RecipeCard.css";

const RecipeCard = ({ recipe, setSelectedRecipe }) => {
    return (
        <button className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
            <h2 className="recipe-card__name">{recipe.name}</h2>
            <p className="recipe-card__description">{recipe.description}</p>
            <div className="recipe-card__details">
                <p className="recipe-card__servings">
                    Servings: {recipe.servings}
                </p>
                <p className="recipe-card__time">
                    Prep Time: {recipe.prepTime}
                </p>
                <p className="recipe-card__time">
                    Cook Time: {recipe.cookTime}
                </p>
            </div>
        </button>
    );
};

RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        servings: PropTypes.number.isRequired,
        prepTime: PropTypes.number.isRequired,
        cookTime: PropTypes.number.isRequired,
    }).isRequired,
    setSelectedRecipe: PropTypes.func.isRequired,
};

export default RecipeCard;
