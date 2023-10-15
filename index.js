const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// meddleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aw4yj2r.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("insertDB");
    const coffeeCreateData = database.collection("coffeeUser");

    // const userCollaction = database.collection("userAccount");
    const userCreateCollaction = database.collection("createUserAccount");

    app.get("/user", async (req, res) => {
      const cursor = coffeeCreateData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const data = req.params.id;
      console.log(data);
      const singleData = { _id: new ObjectId(data) };
      const result = await coffeeCreateData.findOne(singleData);
      console.log(result);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const userCoffee = req.body;
      console.log(userCoffee);
      const result = await coffeeCreateData.insertOne(userCoffee);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      console.log(id, coffee);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      // name, chef, supplier, taste, category, details, photo
      const updateCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };
      const result = await coffeeCreateData.updateOne(
        filter,
        updateCoffee,
        options
      );
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const singleCoffee = req.params.id;
      const options = { _id: new ObjectId(singleCoffee) };
      const result = await coffeeCreateData.deleteOne(options);
      res.send(result);
    });

    app.get("/createUsers", async (req, res) => {
      const getUsers = userCreateCollaction.find();
      const result = await getUsers.toArray();
      res.send(result);
    });

    app.post("/createUsers", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCreateCollaction.insertOne(user);
      res.send(result);
    });

    app.patch("/createUsers", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          lastSignInTimeAt: user.lastSignInTimeAt,
        },
      };
      const result = await userCreateCollaction.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/createUsers/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const options = { _id: new ObjectId(id) };
      const result = await userCreateCollaction.deleteOne(options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is running!");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
