import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-southeast-2_vgDaCIjpR",
    ClientId: "r8gol1o731iv3eik4ilagjd7h",
};

export default new CognitoUserPool(poolData);