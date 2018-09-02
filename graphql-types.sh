const { generateTypeScriptTypes } = require("graphql-schema-typescript");
const fetch = require("node-fetch");

fetch("http://localhost:3000/graphql")
  .then(response => response.text())
  .then(schema =>
    generateTypeScriptTypes(schema, "App/Types/graphql.d.ts", {})
      .then(() => {
        console.log("DONE");
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      })
  );
