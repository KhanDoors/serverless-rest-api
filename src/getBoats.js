const AWS = require("aws-sdk");
// const middy = require("@middy/core");
// const validator = require("@middy/validator");
// const getBoatsSchema = require("./lib/getBoatsSchema");

const getBoats = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  const { tags } = event.queryStringParameters;
  let boats;

  const params = {
    TableName: "boats",
    IndexName: "tagsByDate",
    KeyConditionExpression: "#tags = :tags",
    ExpressionAttributeValues: {
      ":tags": tags,
    },
    ExpressionAttributeNames: {
      "#tags": "tags",
    },
  };

  try {
    const result = await db.query(params).promise();
    boats = result.Items;
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(boats),
  };
};

// module.exports = {
//   handler: middy(getBoats).use(
//     validator({
//       inputSchema: getBoatsSchema,
//       ajvOptions: {
//         useDefaults: true,
//         strict: false,
//       },
//     })
//   ),
// };

module.exports = {
  handler: getBoats,
};
