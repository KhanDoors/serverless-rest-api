const AWS = require("aws-sdk");
const middy = require("@middy/core");
const validator = require("@middy/validator");

const getBoats = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  const { tags, media_type } = event.queryStringParameters;
  let boats;

  const params = {
    TableName: "boats",
    IndexName: "media_type",
    KeyConditionExpression: "#media_type = :media_type",
    ExpressionAttributeValues: {
      ":media_type": media_type,
    },
    ExpressionAttributeNames: {
      "#media_type": "media_type",
    },
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

const boatsSchema = {
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        tags: {
          type: "string",
          default: "react",
        },
        media_type: {
          type: "string",
          enum: ["video", "blog"],
          default: "video",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

module.exports = {
  handler: middy(getBoats).use(
    validator({
      inputSchema: boatsSchema,
      ajvOptions: {
        useDefaults: true,
        strict: false,
      },
    })
  ),
};
