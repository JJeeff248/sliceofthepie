import PropTypes from "prop-types";

import "./Recipe.css";

const Recipe = ({ recipe }) => {
    return (
        <div className="recipe">
            <a className="close" href="/">
                &times;
            </a>
            <h2 className="name">{recipe.name}</h2>
            <p className="description">{recipe.description}</p>

            <div className="details">
                <p className="servings">Servings: {recipe.servings}</p>
                <p className="time">Prep Time: {recipe.prepTime}</p>
                <p className="time">Cook Time: {recipe.cookTime}</p>
            </div>

            <div className="other-details">
                <button
                    className="share"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        document.querySelector(".copy-confirm").style.display =
                            "block";
                        setTimeout(() => {
                            document.querySelector(
                                ".copy-confirm"
                            ).style.display = "none";
                        }, 2000);
                    }}
                >
                    &#128279;
                </button>
                <p className="copy-confirm">Copied to clipboard</p>
            </div>

            <h3 className="tools-header">Tools</h3>
            <ul className="tools">
                {recipe.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                ))}
            </ul>

            <h3 className="ingredients-header">Ingredients</h3>
            <ul className="ingredients">
                {Object.entries(recipe.ingredients).map(
                    ([ingredient, { quantity, measurement }]) => (
                        <li key={ingredient} className="ingredient">
                            {ingredient}: {quantity} {measurement || ""}
                        </li>
                    )
                )}
            </ul>

            <h3 className="method-header">Method</h3>
            <div className="method">
                {recipe.method.map((step) => (
                    <div key={step.stepName} className="step">
                        <h3 className="step-name">{step.stepName}</h3>
                        <p className="step-content">{step.content}</p>
                        {step.tips ? (
                            <ul className="step-tips">
                                {step.tips.map((tip) => (
                                    <li key={tip}>{tip}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

Recipe.propTypes = {
    recipe: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        ingredients: PropTypes.shape({
            quantity: PropTypes.number.isRequired,
        }).isRequired,
        method: PropTypes.array.isRequired,
        servings: PropTypes.number.isRequired,
        tools: PropTypes.array.isRequired,
        prepTime: PropTypes.number.isRequired,
        cookTime: PropTypes.number.isRequired,
        recipeID: PropTypes.string.isRequired,
    }).isRequired,
};

export default Recipe;
