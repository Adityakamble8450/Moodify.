const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./src/config/database');

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
