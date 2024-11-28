// index.js
// path: C:\Users\Atharva JAgtap\OneDrive\Desktop\AWS_SAM\Serverless_Backend\my-sam-backend\App_Backend\index.js

const serverlessExpress = require("@vendia/serverless-express");
const app = require("./app");

exports.handler = serverlessExpress({ app });
