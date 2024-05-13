const express = require('express');
const app = express();
const { MongoClient, ObjectID } = require('mongodb');
const cron = require('node-cron');


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const uri = 'mongodb+srv://balpreet:ct8bCW7LDccrGAmQ@cluster0.2pwq0w2.mongodb.net/enayetTest'

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,  
  });
  let db;

async function connect() {
    try {
        await client.connect();  // Attempt to connect
        db = client.db(); // Assigns the database handle
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
        throw error; // Rethrow or handle error appropriately
    }
    return db;
}

async function getDb() {
    if (!db) {
        await connect();
    }
    return db;
}

async function getCollections() {
    const db = await getDb();
    return {
    
        videoCollection: db.collection("FinalVideo")
    };
}

async function addToCollection() {
  try {
      const { videoCollection } = await getCollections();
      await videoCollection.insertOne({ message: "Hello" });
      console.log("Added 'Hello' to videoCollection");
  } catch (error) {
      console.error("Failed to add 'Hello' to videoCollection:", error);
  }
}

cron.schedule('*/10 * * * * *', async () => {
  console.log('Running a task every 10 seconds');
  await addToCollection();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

