const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const addBoat = async (event) => {
  const db = new AWS.DynamoDB.DocumentClient();
  const { title, desc, url, image, media_type, tags } = event.body;
  const createdAt = new Date().toISOString();
  const id = v4();

  const newBoat = {
    title,
    createdAt,
    id,
    desc,
    url,
    image,
    media_type,
    tags,
  };

  try {
    await db
      .put({
        TableName: "boats",
        Item: newBoat,
      })
      .promise();
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(newBoat),
  };
};

module.exports = {
  handler: middy(addBoat).use(httpJsonBodyParser()),
};
