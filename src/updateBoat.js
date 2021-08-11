const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const updateBoat = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  const { tags } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  const params = {
    TableName: "boats",
    Key: { id },
    UpdateExpression: "set tags = :tags",
    ExpressionAttributeValues: {
      ":tags": tags,
    },
    ReturnValues: "ALL_NEW",
  };
  let updatedBoat;

  try {
    const result = await db.update(params).promise();
    updatedBoat = result.Attributes;
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedBoat),
  };
};

module.exports = {
  handler: updateBoat,
};
