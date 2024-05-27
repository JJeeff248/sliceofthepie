import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const tableName = "recipes";

export const handler = async (event) => {
    if (event.requestContext.http.method === "GET") {
        if (event.pathParameters?.recipeId)
            return await getRecipe(event.pathParameters.recipeId);

        return await getRecipes();
    } else {
        return {
            statusCode: 404,
            body: "Not found",
        };
    }
};

const getRecipe = async (recipeId) => {
    console.log(recipeId);

    const params = {
        TableName: tableName,
        Key: {
            recipeID: { S: recipeId },
        },
    };

    try {
        const command = new ScanCommand(params);
        const data = await client.send(command);
        const recipe = unmarshall(data.Items[0]);
        return {
            statusCode: 200,
            body: JSON.stringify(recipe),
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Recipe not found" }),
        };
    }
};

const getRecipes = async () => {
    const params = {
        TableName: tableName,
        ScanIndexForward: false,
    };
    const command = new ScanCommand(params);
    const data = await client.send(command);

    let recipes = data.Items.map((item) => unmarshall(item));

    return {
        statusCode: 200,
        body: JSON.stringify(recipes),
    };
};
