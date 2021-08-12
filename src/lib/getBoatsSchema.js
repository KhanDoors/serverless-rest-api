const schema = {
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        tags: {
          type: "string",
          enum: ["react", "materialui"],
          default: "react",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

export default schema;
