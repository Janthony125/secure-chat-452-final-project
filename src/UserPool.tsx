import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_8d2fFKELo",
    ClientId: "29s3vmldesu7cilggr2i1dgll6"
}

export default new CognitoUserPool(poolData)