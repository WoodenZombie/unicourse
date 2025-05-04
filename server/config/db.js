import mongoose from 'mongoose';
const { connection, connect } = mongoose;

const connectDB = async () => {
  try {
    // connection event listeners
    connection.on('connecting', () => console.log('Connecting to MongoDB...'));
    connection.on('connected', () => console.log('MongoDB connected successfully!'));
    connection.on('error', (err) => console.error('MongoDB connection error:', err));
    connection.on('disconnected', () => console.warn('MongoDB disconnected!'));
    connection.on('reconnected', () => console.log('MongoDB reconnected!'));

    // connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    // local MongoDB connection string
    const dbUrl = 'mongodb://127.0.0.1:27017/unicourse?directConnection=true';

    // establish connection
    await connect(dbUrl, options);

    // log successful connection details
    console.log(`📊 MongoDB Connected:
      Host: ${connection.host}
      Port: ${connection.port}
      Database: ${connection.name}
      Ready State: ${connection.readyState === 1 ? 'Connected' : 'Disconnected'}
    `);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    
    // shutdown if connection fails
    process.exit(1);
  }
};

// handle process termination
process.on('SIGINT', async () => {
  await connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;