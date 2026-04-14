const app = require('./app');
const connectDB = require('./config/db');
const importData = require('./seed');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB(); // Wait for database connection first
  
  if (process.env.DB_MODE === 'memory') {
    await importData();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
