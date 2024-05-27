import PropTypes from "prop-types";

import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
    return (
        <a href={`/${recipe.recipeID}`}>
            <button className="recipe-card">
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
        </a>
    );
};

RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        recipeID: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        servings: PropTypes.number.isRequired,
        prepTime: PropTypes.number.isRequired,
        cookTime: PropTypes.number.isRequired,
    }).isRequired,
};

export default RecipeCard;
