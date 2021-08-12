const AWS = require("aws-sdk");
const middy = require("@middy/core");
const validator = require("@middy/validator");

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

const schema = {
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        tags: {
          type: "string",
          default: "react",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

module.exports = {
  handler: middy(getBoats).use(
    validator({
      inputSchema: schema,
      ajvOptions: {
        useDefaults: true,
        strict: false,
      },
    })
  ),
};
