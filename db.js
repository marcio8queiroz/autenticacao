//db.js
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, objectId } = require("mongodb");

async function connect() {
    const client = new MongoClient(process.env.MONGODB_CONNECTION, { useUnifiedTopology: true });
    if (!global.connection)
        try {
            await client.connect();
            global.connection = client.db("aula");
            console.log("Connected to MongoDB!");
        } catch (error) {
            console.error("Error connecting to the database:", error);
            global.connection = null;
            throw error;
        }
}

async function findCustomers() {
    try {
        await connect(); // Garante que a conexão esteja estabelecida antes de buscar clientes
        const docs = await global.connection
            .collection("clientes")
            .find({})
            .toArray();
        // callback(null, docs);
        return docs;
    } catch (error) {
        console.error("Error finding customers:", error);
        throw error;
        //callback(error, null);
    }
}

async function findCustomer(id) {
    connect();
    const objectId = new ObjectId(id); //caiu em desuso
    return global.connection
        .collection("clientes")
        .findOne({ _id: objectId });
}

async function insertCustomer(customer) {
    connect();
    return global.connection
        .collection("clientes")
        .insertOne(customer);
}

async function updateCustomer(id, customer) {
    connect();
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
        .collection("clientes")
        .updateOne({ _id: objectId }, { $set: customer });
}
async function deleteCustomer(id) {
    connect();
    const objectId = ObjectId.createFromHexString(id); // esse é o novo
    return global.connection
        .collection("clientes")
        .deleteOne({ _id: objectId });
}
module.exports = { findCustomers, insertCustomer, updateCustomer, deleteCustomer, findCustomer };