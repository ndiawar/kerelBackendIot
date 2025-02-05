const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  ph: Number,
  water_level: Number,
  createdAt: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', SensorDataSchema);

module.exports = SensorData;