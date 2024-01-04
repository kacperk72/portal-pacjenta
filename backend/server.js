const app = require("./src/app");
const dbConnection = require("./src/config/dbConfig");

const PORT = process.env.PORT || 3000;

dbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
