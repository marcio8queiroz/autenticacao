//db.js
//const ObjectId = require("mongodb").ObjectId;
const { MongoClient, objectId } = require("mongodb");

const PAGE_SIZE = 5;

async function connect() {
    if (global.connection) {
        return global.connection;
    }
    const client = new MongoClient(process.env.MONGODB_CONNECTION, { useUnifiedTopology: true });
    try {
        await client.connect();
        global.connection = client.db(process.env.MONGODB_DATABASE);
        console.log("Connected to MongoDB!");
        return global.connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

async function countCustomers() {
    const connection = await connect();
    return connection.collection("customers").countDocuments();
}

async function findCustomers(page = 1) {
    try {
        const totalSkip = (page - 1) * PAGE_SIZE;
        await connect(); // Garante que a conexão esteja estabelecida antes de buscar clientes
        const docs = await connection
            .collection("customers")
            .find({})
            .skip(totalSkip)
            .limit(PAGE_SIZE)
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
    try {
        const connection = await connect();
        const objectId = new objectId(id);
        return connection.collection("customers").findOne({ _id: objectId });
    } catch (error) {
        console.error("Erro ao encontrar o cliente:", error);
        throw error;
    }
}

async function insertCustomer(customer) {
    try {
        const connection = await connect();
        return connection.collection("customers").insertOne(customer);
    } catch (error) {
        console.error("Erro ao inserir cliente:", error);
        throw error;
    }
}
async function updateCustomer(id, customer) {
    connect();
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
        .collection("customers")
        .updateOne({ _id: objectId }, { $set: customer });
}
async function deleteCustomer(id) {
    connect();
    const objectId = ObjectId.createFromHexString(id); // esse é o novo
    return global.connection
        .collection("customers")
        .deleteOne({ _id: objectId });
}
module.exports = { PAGE_SIZE, findCustomers, insertCustomer, updateCustomer, deleteCustomer, findCustomer, countCustomers, connect };