# Serverless Node.js Application with MongoDB Integration

## Overview

This project involves deploying a Node.js application on AWS Lambda using the AWS Serverless Application Model (SAM). The app connects to MongoDB Atlas to perform CRUD operations. The application is designed to be highly scalable and serverless, making it suitable for cloud-native environments.

## Setup & Configuration

### 1. **Dependencies**

The application requires several dependencies to run successfully. These include:

- **express**: A minimal web application framework for Node.js.
- **bcryptjs**: A library for hashing passwords.
- **mongoose**: A library to interact with MongoDB.
- **dotenv**: Used to manage environment variables.
- **serverless-express**: To run the Express app in AWS Lambda.
- **axios**: For making HTTP requests.
- **jsonwebtoken**: For managing JWT tokens for authentication.
- **cookie-parser**, **cors**, **nodemon**: Miscellaneous utilities.

**Package Installation:**

```bash
npm install express mongoose bcryptjs dotenv serverless-express axios jsonwebtoken cookie-parser cors nodemon
```

### 2. **AWS Serverless Application Model (SAM) Setup**

Your `template.yaml` configures AWS Lambda and API Gateway for your serverless app:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: >
  my-sam-backend

Globals:
  Function:
    Timeout: 12
    LoggingConfig:
      LogFormat: JSON

Resources:
  MySamBackendFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: App_Backend/
      Handler: index.handler
      Runtime: nodejs18.x
      Architectures:
        - x86_64
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /api/{proxy+}
            Method: any
      Environment:
        Variables:
          NODE_ENV: "production"
          CONNECTION_URL: "your-connection-url"
```

`NOTE:` You can keep the environment variables in template.yaml file for lambda to directly read from its execution environment, or for best practice you can use service like AWS Secrets Manager and read your critical variables from there.

### 3. **MongoDB Atlas Setup**

1. Create a MongoDB Atlas account and cluster.
2. Create a user and database for the app.
3. Whitelist your Lambda IP or use `0.0.0.0/0` for quick testing (not recommended for production).

### 4. **Environment Variables**

You store sensitive information such as the MongoDB connection URL in environment variables.

- **MongoDB Connection URL**: This is stored in `process.env.CONNECTION_URL` and used for connecting to the MongoDB database.

```js
const mongoose = require("mongoose");

const CONNECTION_URL = process.env.CONNECTION_URL; // read directly from lambda environment

const DBConnection = () => {
  if (CONNECTION_URL) {
    mongoose
      .connect(CONNECTION_URL)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
      });
  } else {
    console.log("No connection URL provided");
  }
};

module.exports = DBConnection;
```

### 5. **AWS Lambda Configuration**

- Your Lambda function is configured to read the environment variable `CONNECTION_URL` from AWS Lambda's environment settings, which is defined in `template.yaml`.
- The Lambda function connects to MongoDB Atlas using Mongoose and establishes a connection.

---

## Problems Faced

### 1. **Incorrect MongoDB Connection Setup**

#### Issue:

The MongoDB connection was not being established, and the following error message appeared:

```
Error connecting to MongoDB: MongoError: failed to connect to server [mongodb://...] on first connect
```

#### Solution:

- This issue was due to the MongoDB Atlas not accepting connections from all IP addresses by default.
- The solution was to allow connections from `0.0.0.0/0` (all IP addresses) temporarily for testing purposes. This can be done in the MongoDB Atlas Network Access settings.

### 2. **Missing Dependencies (bcryptjs)**

#### Issue:

When running the server locally or deploying the app, an error occurred stating that `bcryptjs` was missing:

```
Error: Cannot find module 'bcryptjs'
```

#### Solution:

- The app initially used `bcrypt`, which was replaced by `bcryptjs`. You had to uninstall `bcrypt` and install `bcryptjs` for the Lambda function to work correctly.
- The `bcryptjs` module was included in the `package.json` file.

### 3. **Deprecation Warnings in MongoDB Driver**

#### Issue:

Warnings regarding the deprecated options `useNewUrlParser` and `useUnifiedTopology` were shown:

```
Warning: useNewUrlParser is a deprecated option...
Warning: useUnifiedTopology is a deprecated option...
```

#### Solution:

- These warnings were related to the MongoDB driver. The latest MongoDB Node.js driver no longer requires these options.
- They were removed to comply with the newer versions of the MongoDB driver.

### 4. **Connection URL Not Working in Lambda**

#### Issue:

The connection URL stored in `process.env.CONNECTION_URL` was correctly read, but the connection was still failing without any output.

#### Solution:

- The issue was resolved after checking MongoDB Atlas for network settings and allowing connections from all IP addresses (`0.0.0.0/0`).
- Ensure that the environment variable `CONNECTION_URL` is correctly set in both local `.env` files and in AWS Lambda environment variables.

### 5. **Database Connection Function Not Async**

#### Issue:

The `DBConnection` function was not defined as an `async` function. As a result, the application continued running asynchronously without waiting for the database connection to establish. This caused timeout errors when calling Mongoose functions like `find()` and `findOne()`.

#### Solution:

The `DBConnection` function was updated to use `async/await` to ensure that the application waits for the connection to be established before proceeding. The updated function is as follows:

```javascript
// Connection function
const DBConnection = async () => {
  console.log(`THE CONNECTION URL >>>>>> ${CONNECTION_URL}`);
  if (CONNECTION_URL) {
    await mongoose
      .connect(CONNECTION_URL)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message); // Log the error message
        console.error("Full error details:", err); // Log the full error object for deeper inspection
      });
  } else {
    console.log("No connection URL provided");
  }
};
```

---

`NOTE:` The application logs that drop in your aws cloudwatch console come in really handy to identify where in your application the issue persist. So keep in check with those logs. The logs associated with your api gateway or your lambda function are the ones you need to go through for identifying potential issues.

---

## Deployment Steps

1. **Prepare the Lambda Function**
   - Place your code inside the `App_Backend/` folder.
   - Define the Lambda handler in `index.js`.
2. **Configure Environment Variables in AWS Lambda**

   - In `template.yaml`, specify the environment variables such as `CONNECTION_URL`.
   - Ensure your `template.yaml` is configured to pass the MongoDB connection URL to Lambda.

3. **Deploy with AWS SAM**

   - Build the Lambda function:
     ```bash
     sam build
     ```
   - Deploy the application:
     ```bash
     sam deploy --guided
     ```

4. **Monitor Logs in CloudWatch**

   - Once deployed, monitor your application’s logs through CloudWatch to check for issues, particularly regarding the MongoDB connection.
   - Logs will be available under the **CloudWatch Logs** section in AWS Console.

---

## Troubleshooting

### MongoDB Connection Issues

- **Check MongoDB Atlas Whitelist**: Ensure the IP addresses of your Lambda function are allowed in the **Network Access** settings of MongoDB Atlas.
- **Environment Variable Setup**: Double-check that `CONNECTION_URL` is correctly set in Lambda’s environment variables.
- **Connection String**: Ensure the MongoDB connection string is correctly formatted and contains the correct credentials and database name.

### AWS Lambda Errors

- **Timeout Issues**: If your Lambda function times out, increase the timeout value in the `template.yaml` file under `Globals` -> `Function`.
- **Missing Dependencies**: Ensure all required dependencies are listed in `package.json` and installed using `npm install`.

---

## Conclusion

This documentation covered setting up a **Serverless Node.js app** with **MongoDB Atlas** integration on **AWS Lambda**. It also provided insights into common problems faced during development, such as connection issues, missing dependencies, and warnings from MongoDB. The solution to each problem has been outlined for smoother development and deployment.
