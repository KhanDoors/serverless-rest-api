const AWS = require("aws-sdk");

const getBoat = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;
  let boat;

  const params = {
    TableName: "boats",
    Key: { id },
  };

  try {
    const result = await db.get(params).promise();
    boat = result.Item;
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(boat),
  };
};

module.exports = {
  handler: getBoat,
};
