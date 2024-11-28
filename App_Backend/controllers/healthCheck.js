// healthCheck controller
// path : C:\Users\Atharva JAgtap\OneDrive\Desktop\AWS_SAM\Serverless_Backend\my-sam-backend\App_Backend\controllers\healthCheck.js

const healthCheckFunction = async (req, res) => {
  try {
    res.status(200).json({
      message: "Application Healthy",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = healthCheckFunction;
