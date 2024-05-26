import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const tableName = "recipes";

export const handler = async (event) => {
    if (event.requestContext.http.method === "GET") {
        return await getRecipes();
    } else {
        return {
            statusCode: 404,
            body: "Not found",
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
