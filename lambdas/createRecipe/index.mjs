import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../recipe.db.csv');

export const handler = async (event) => {
    try {
        const { title, ingredients, instructions } = JSON.parse(event.body);

        // Basic validation
        if (!title || !ingredients || !instructions) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Read existing recipes
        const data = await fs.readFile(dbPath, 'utf-8');
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        // Create new recipe entry
        const newRecipe = [
            title,
            ingredients.join('|'),
            instructions.join('|'),
            new Date().toISOString()
        ];

        // Append new recipe
        await fs.appendFile(dbPath, '\n' + newRecipe.join(','));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Recipe created successfully' })
        };
    } catch (error) {
        console.error('Error creating recipe:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create recipe' })
        };
    }
};
