const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agkw3if.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //  await client.connect();
    const shopCollection = client.db('babyboToys').collection('shopData');

  

    app.get('/shopData', async (req, res) => {

      const cursor = shopCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/shopData", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const result = await shopCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/categorydata', async (req, res) => {
      const categoryName = req.query.category;
      let query = {};
      if (categoryName) {
        query = { category: categoryName }
      }
      const result = await shopCollection.find(query).limit(2).toArray();
      res.send(result);
    })


    app.get('/searchdata', async (req, res) => {
      const search = req.query.search;
      let query = {}
      if (search) {
        query = { toyName: { $regex: search, $options: 'i' } }
      }

      const result = await shopCollection.find(query).limit(20).toArray();
      res.send(result);
    })



    app.get('/shopData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await shopCollection.findOne(query).limit(20);
      res.send(result);
    })


    app.post("/addtoy", async (req, res) => {
      const data = req.body;
      const result = await shopCollection.insertOne(data)
      res.send(result)
    })


    app.patch('/addtoy/:id', async (req, res) => {
      const id = req.params.id;
      const updated = req.body
      console.log(id, updated)
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          price: updated.price,
          quantity: updated.quantity,
          details: updated.details
        }
      }
      const result = await shopCollection.updateOne(query, updateDoc)
      console.log(result)
      res.send(result)
    })
    

    app.delete('/shopData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await shopCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    //  await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('shop is running server')
})






app.listen(port, () => {
  console.log(`shop server running on port ${port}`)
})