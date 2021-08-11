const AWS = require("aws-sdk");

const getBoats = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  let boats;

  const params = {
    TableName: "boats",
  };

  try {
    const result = await db.scan(params).promise();
    boats = result.Items;
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(boats),
  };
};

module.exports = {
  handler: getBoats,
};
