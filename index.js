const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000



// middle wire
app.use(cors())
app.use(express.json())


// password: gM7GXvVzX8d9gVy6
// user: dbuser2
// OID1GwQm5ElawJZ4


const uri = "mongodb+srv://dbuser1:OID1GwQm5ElawJZ4@cluster0.kykmokn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');

        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result)
            console.log(updatedUser);

        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            console.log('trying to delet id', id);
            const query = { _id: ObjectId(id) }

            const result = await userCollection.deleteOne(query)
            console.log(result)
            res.send(result)

        })
    }
    finally {

    }
}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send("hello from node mongo server")
})


app.listen(port, () => {
    console.log(`server runing at port: ${port}`);
})