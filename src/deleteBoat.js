const AWS = require("aws-sdk");

const deleteBoat = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const params = {
    TableName: "boats",
    Key: { id },
  };

  try {
    await db.delete(params).promise();
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

module.exports = {
  handler: deleteBoat,
};
