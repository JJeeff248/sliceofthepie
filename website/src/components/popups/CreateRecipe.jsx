import { useState, useContext } from "react";
import PropTypes from "prop-types";
import "./Popup.css";
import { AccountContext } from "../../Account";


const CreateRecipe = ({ setCreateRecipeOpen }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [error, setError] = useState("");

    const { getSession } = useContext(AccountContext);

    const api = "https://api.chris-sa.com/recipes";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(api + "/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: await getSession().then(
                        (session) => session.accessToken.jwtToken
                    ),
                },
                body: JSON.stringify({
                    title,
                    ingredients: ingredients.split("\n"),
                    instructions: instructions.split("\n"),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create recipe");
            }

            setCreateRecipeOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup">
            <div className="popup__content">
                <h2>Create New Recipe</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredients (one per line)</label>
                        <textarea
                            id="ingredients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            required
                            rows={5}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructions">Instructions (one step per line)</label>
                        <textarea
                            id="instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            required
                            rows={5}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="button-group">
                        <button type="submit">Create Recipe</button>
                        <button type="button" onClick={() => setCreateRecipeOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateRecipe.propTypes = {
    setCreateRecipeOpen: PropTypes.func.isRequired,
};

export default CreateRecipe;
