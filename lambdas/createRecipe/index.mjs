import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const { title, ingredients, instructions } = JSON.parse(event.body);
        const userId = event.requestContext.authorizer.claims.sub;
        const username = event.requestContext.authorizer.claims.preferred_username;

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

        const recipeId = randomUUID();
        const now = new Date().toISOString();

        // Format ingredients into the required structure
        const formattedIngredients = ingredients.reduce((acc, ingredient) => {
            acc[ingredient] = {
                M: {
                    measurement: { S: "" },
                    amount: { N: "1" }
                }
            };
            return acc;
        }, {});

        const recipe = {
            recipeID: recipeId,
            author: username,
            name: title,
            description: "",
            ingredients: formattedIngredients,
            method: instructions,
            cookTime: "0",
            prepTime: "0",
            servings: "1",
            tools: [],
            createdAt: now,
            updatedAt: now,
            userId: userId
        };

        await docClient.send(
            new PutCommand({
                TableName: "recipes",
                Item: recipe
            })
        );

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Recipe created successfully', recipeId })
        };
    } catch (error) {
        console.error('Error creating recipe:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Failed to create recipe' })
        };
    }
};
