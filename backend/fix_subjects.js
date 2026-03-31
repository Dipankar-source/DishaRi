const mongoose = require('mongoose');
const Subject = require('./src/database/Subject');
require('dotenv').config();

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const subjects = await Subject.find({});
  for (const s of subjects) {
    s.totalTopics = s.topics.length;
    await s.save();
    console.log(`Updated ${s.name}: ${s.totalTopics} topics`);
  }
  process.exit();
}
fix();
