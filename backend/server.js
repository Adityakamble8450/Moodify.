const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDb = require('./src/config/database');
const redis = require('./src/config/cache');

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
