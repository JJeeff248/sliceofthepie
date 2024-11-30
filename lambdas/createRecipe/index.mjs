import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        
        // Validate auth context first (HTTP API Gateway v2.0 format)
        if (!event.requestContext?.authorizer?.jwt?.claims) {
            console.error('Missing authentication context');
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Authentication required' })
            };
        }

        const { name, description, prepTime, cookTime, servings, ingredients, method, tools, tags } = JSON.parse(event.body);
        const userId = event.requestContext.authorizer.jwt.claims.sub;
        const username = event.requestContext.authorizer.jwt.claims.username;

        // Basic validation
        if (!name || !method) {
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
            if (ingredient.item) {
                acc[ingredient.item] = {
                    measurement: ingredient.measurement || "",
                    amount: ingredient.amount || "1"
                };
            }
            return acc;
        }, {});

        const recipe = {
            recipeID: recipeId,
            userID: userId,
            author: username,
            name: name,
            description: description || "",
            ingredients: formattedIngredients,
            method: method,
            cookTime: `${cookTime?.hours || "0"}:${cookTime?.minutes || "0"}`,
            prepTime: `${prepTime?.hours || "0"}:${prepTime?.minutes || "0"}`,
            servings: servings || "1",
            tools: tools || [],
            tags: tags || [],
            createdAt: now,
            updatedAt: now
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
