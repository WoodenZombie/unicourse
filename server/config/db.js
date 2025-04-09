const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Добавляем обработчики событий перед подключением
    mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'));
    mongoose.connection.on('connected', () => console.log('✅ MongoDB connected!'));
    mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB disconnected!'));

    // Подключаемся с улучшенными параметрами
    await mongoose.connect('mongodb://127.0.0.1:27017/unicourse?directConnection=true', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, // Таймаут для операций
      maxPoolSize: 10 // Максимальное количество соединений
    });

    console.log('MongoDB Connected:', mongoose.connection.host);
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;