import { useState, useContext } from "react";
import { AccountContext } from "../Account";
import PropTypes from "prop-types";
import "./Recipe.css";
import "./CreateRecipe.css";

const CreateRecipe = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        prepTime: { hours: "", minutes: "" },
        cookTime: { hours: "", minutes: "" },
        servings: "",
        ingredients: [],
        method: [],
        tools: [],
        tags: []
    });
    const [error, setError] = useState("");
    const [newIngredient, setNewIngredient] = useState({ item: "", quantity: "", unit: "" });
    const [newMethodStep, setNewMethodStep] = useState("");
    const [newTool, setNewTool] = useState({ item: "", quantity: "" });
    const [newTag, setNewTag] = useState("");
    const { getSession } = useContext(AccountContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const handleTimeChange = (timeType, field, value) => {
        // Ensure only numbers are entered
        if (value && !/^\d*$/.test(value)) return;

        // For minutes, ensure it's not more than 59
        if (field === 'minutes' && parseInt(value) > 59) return;

        setFormData(prev => ({
            ...prev,
            [timeType]: {
                ...prev[timeType],
                [field]: value
            }
        }));
    };

    const addIngredient = () => {
        if (newIngredient.item && newIngredient.quantity && newIngredient.unit) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, { ...newIngredient }]
            }));
            setNewIngredient({ item: "", quantity: "", unit: "" });
        }
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const addMethodStep = () => {
        if (newMethodStep.trim()) {
            setFormData(prev => ({
                ...prev,
                method: [...prev.method, newMethodStep.trim()]
            }));
            setNewMethodStep("");
        }
    };

    const removeMethodStep = (index) => {
        setFormData(prev => ({
            ...prev,
            method: prev.method.filter((_, i) => i !== index)
        }));
    };

    const addTool = () => {
        if (newTool.item && newTool.quantity) {
            setFormData(prev => ({
                ...prev,
                tools: [...prev.tools, { ...newTool }]
            }));
            setNewTool({ item: "", quantity: "" });
        }
    };

    const removeTool = (index) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.filter((_, i) => i !== index)
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

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
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to create recipe");
            }

            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="create-recipe">
            <div className="create-recipe-content">
                <a href="/" className="close-button">&times;</a>
                <h2>Create New Recipe</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Recipe Name"
                            required
                            className="name"
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Recipe Description"
                            required
                            className="description"
                        />
                    </div>

                    <div className="recipe-meta">
                        <div className="time-input">
                            <input
                                type="number"
                                value={formData.prepTime.hours}
                                onChange={(e) => handleTimeChange('prepTime', 'hours', e.target.value)}
                                placeholder="00"
                                min="0"
                                max="99"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                value={formData.prepTime.minutes}
                                onChange={(e) => handleTimeChange('prepTime', 'minutes', e.target.value)}
                                placeholder="00"
                                min="0"
                                max="59"
                            />
                            <span className="time-label">Prep Time (hh:mm)</span>
                        </div>
                        <div className="time-input">
                            <input
                                type="number"
                                value={formData.cookTime.hours}
                                onChange={(e) => handleTimeChange('cookTime', 'hours', e.target.value)}
                                placeholder="00"
                                min="0"
                                max="99"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                value={formData.cookTime.minutes}
                                onChange={(e) => handleTimeChange('cookTime', 'minutes', e.target.value)}
                                placeholder="00"
                                min="0"
                                max="59"
                            />
                            <span className="time-label">Cook Time (hh:mm)</span>
                        </div>
                        <input
                            type="number"
                            value={formData.servings}
                            onChange={handleChange}
                            name="servings"
                            placeholder="Servings"
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ingredients</label>
                        <div className="ingredients-list">
                            {formData.ingredients.map((ing, index) => (
                                <div key={index} className="ingredient-item">
                                    <input
                                        type="text"
                                        value={ing.item}
                                        onChange={(e) => {
                                            const newIngredients = [...formData.ingredients];
                                            newIngredients[index].item = e.target.value;
                                            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                                        }}
                                    />
                                    <input
                                        type="number"
                                        value={ing.quantity}
                                        onChange={(e) => {
                                            const newIngredients = [...formData.ingredients];
                                            newIngredients[index].quantity = e.target.value;
                                            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                                        }}
                                        min="0"
                                        step="0.01"
                                    />
                                    <input
                                        type="text"
                                        value={ing.unit}
                                        onChange={(e) => {
                                            const newIngredients = [...formData.ingredients];
                                            newIngredients[index].unit = e.target.value;
                                            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                                        }}
                                    />
                                    <button type="button" onClick={() => removeIngredient(index)}>&times;</button>
                                </div>
                            ))}
                            <div className="ingredient-item">
                                <input
                                    type="text"
                                    value={newIngredient.item}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, item: e.target.value }))}
                                    placeholder="Ingredient"
                                />
                                <input
                                    type="number"
                                    value={newIngredient.quantity}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                                    placeholder="Amount"
                                    min="0"
                                    step="0.01"
                                    onKeyPress={(e) => handleKeyPress(e, addIngredient)}
                                />
                                <input
                                    type="text"
                                    value={newIngredient.unit}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                                    placeholder="Unit"
                                />
                                <button type="button" onClick={addIngredient} className="add-ingredient">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Method Steps</label>
                        <div className="method-list">
                            {formData.method.map((step, index) => (
                                <div key={index} className="method-item">
                                    <span className="step-number">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => {
                                            const newMethod = [...formData.method];
                                            newMethod[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, method: newMethod }));
                                        }}
                                    />
                                    <button type="button" onClick={() => removeMethodStep(index)}>×</button>
                                </div>
                            ))}
                            <div className="method-item">
                                <input
                                    type="text"
                                    value={newMethodStep}
                                    onChange={(e) => setNewMethodStep(e.target.value)}
                                    placeholder="Add a step"
                                    onKeyPress={(e) => handleKeyPress(e, addMethodStep)}
                                />
                                <button type="button" onClick={addMethodStep} className="add-method">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tools & Equipment</label>
                        <div className="tools-list">
                            {formData.tools.map((tool, index) => (
                                <div key={index} className="tool-item">
                                    <input
                                        type="text"
                                        value={tool.item}
                                        onChange={(e) => {
                                            const newTools = [...formData.tools];
                                            newTools[index].item = e.target.value;
                                            setFormData(prev => ({ ...prev, tools: newTools }));
                                        }}
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        value={tool.quantity}
                                        onChange={(e) => {
                                            const newTools = [...formData.tools];
                                            newTools[index].quantity = e.target.value;
                                            setFormData(prev => ({ ...prev, tools: newTools }));
                                        }}
                                    />
                                    <button type="button" onClick={() => removeTool(index)}>×</button>
                                </div>
                            ))}
                            <div className="tool-item">
                                <input
                                    type="text"
                                    value={newTool.item}
                                    onChange={(e) => setNewTool(prev => ({ ...prev, item: e.target.value }))}
                                    placeholder="Tool name"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    value={newTool.quantity}
                                    onChange={(e) => setNewTool(prev => ({ ...prev, quantity: e.target.value }))}
                                    placeholder="Quantity"
                                    onKeyPress={(e) => handleKeyPress(e, addTool)}
                                />
                                <button type="button" onClick={addTool} className="add-tool">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <div className="tags-input">
                            <div className="tags-list">
                                {formData.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}>×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === ',' || e.key === 'Enter') {
                                        e.preventDefault();
                                        const tagValue = newTag.trim();
                                        if (tagValue && !formData.tags.includes(tagValue)) {
                                            setFormData(prev => ({
                                                ...prev,
                                                tags: [...prev.tags, tagValue]
                                            }));
                                            setNewTag('');
                                        }
                                    }
                                }}
                                placeholder="Add tags (separate with comma)"
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    <div className="button-group">
                        <button type="button" onClick={() => window.location.href = '/'} className="cancel-button">Cancel</button>
                        <button type="submit" className="submit-button">Create Recipe</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateRecipe.propTypes = {
    setCreateRecipeOpen: PropTypes.func
};

export default CreateRecipe;
