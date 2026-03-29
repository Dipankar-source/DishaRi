const mongoose = require('mongoose');
const Subject = require('./src/database/Subject');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const subjects = await Subject.find({});
  console.log('--- SUBJECTS CHECK ---');
  subjects.forEach(s => {
    console.log(`Subject: ${s.name}, Topics Count: ${s.topics.length}, totalTopics field: ${s.totalTopics}`);
  });
  process.exit();
}
check();
