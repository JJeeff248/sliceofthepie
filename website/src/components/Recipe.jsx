import PropTypes from "prop-types";

import "./Recipe.css";

const Recipe = ({ recipe }) => {
    console.log(recipe); // Added for debugging

    return (
        <div className="recipe">
            <a className="close" href="/">
                &times;
            </a>
            <h2 className="name">{recipe.name}</h2>
            <p className="description">{recipe.description}</p>

            {recipe.recipeID !== "error" && (
                <>
                    <div className="details">
                        <p className="servings">Servings: {recipe.servings}</p>
                        <p className="time">Prep Time: {recipe.prepTime}</p>
                        <p className="time">Cook Time: {recipe.cookTime}</p>
                    </div>

                    <div className="other-details">
                        <p className="author">Author: {recipe.author}</p>
                        <button
                            className="share"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                document.querySelector(
                                    ".copy-confirm"
                                ).style.display = "block";
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
                        {recipe.tools.map((tool, index) => (
                            <li key={index}>
                                {tool.item} {tool.quantity && `(${tool.quantity})`}
                            </li>
                        ))}
                    </ul>

                    <h3 className="ingredients-header">Ingredients</h3>
                    <ul className="ingredients">
                        {Object.entries(recipe.ingredients).map(
                            ([ingredient, { quantity, measurement }], index) => (
                                <li key={index} className="ingredient">
                                    {ingredient}: {quantity} {measurement || ""}
                                </li>
                            )
                        )}
                    </ul>

                    <h3 className="method-header">Method</h3>
                    <div className="method">
                        {recipe.method.map((step, index) => (
                            <div key={index} className="step">
                                <span className="step-number">{index + 1}.</span>
                                <p className="step-content">{step}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

Recipe.propTypes = {
    recipe: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        ingredients: PropTypes.object,
        author: PropTypes.string,
        method: PropTypes.array,
        servings: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        tools: PropTypes.arrayOf(
            PropTypes.shape({
                item: PropTypes.string,
                quantity: PropTypes.string
            })
        ),
        prepTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        cookTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        recipeID: PropTypes.string.isRequired,
    }).isRequired,
};

export default Recipe;
