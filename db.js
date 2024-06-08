//db.js
//const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs")

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
        const connection = await connect(); // Garante que a conexão esteja estabelecida antes de buscar clientes
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
        const objectId = new ObjectId(id);
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
    try {
        const connection = await connect();
        const objectId = new ObjectId(id);
        return connection
            .collection("customers")
            .updateOne({ _id: objectId }, { $set: customer });
    } catch (error) {
        console.error("Erro ao atualizar o cliente:", error);
        throw error;
    }
}

async function deleteCustomer(id) {
    try {
        const connection = await connect();
        const objectId = new ObjectId(id);
        return connection
            .collection("customers")
            .deleteOne({ _id: objectId });
    } catch (error) {
        console.error("Erro ao deletar o cliente:", error);
        throw error;
    }
}


//users

async function countUsers() {
    const connection = await connect();
    return connection.collection("users").countDocuments();
}

async function findUsers(page = 1) {
    try {
        const totalSkip = (page - 1) * PAGE_SIZE;
        await connect(); // Garante que a conexão esteja estabelecida antes de buscar clientes
        const docs = await connection
            .collection("users")
            .find({})
            .skip(totalSkip)
            .limit(PAGE_SIZE)
            .toArray();
        // callback(null, docs);
        return docs;
    } catch (error) {
        console.error("Error finding users:", error);
        throw error;
        //callback(error, null);
    }
}

async function findUser(id) {
    try {
        const connection = await connect();
        const objectId = new ObjectId(id);
        return connection.collection("users").findOne({ _id: objectId });
    } catch (error) {
        console.error("Erro ao encontrar o usuário:", error);
        throw error;
    }
}


async function insertUser(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    try {
        const connection = await connect();
        return connection.collection("users").insertOne(user);
    } catch (error) {
        console.error("Erro ao inserir o usuário:", error);
        throw error;
    }
}
async function updateUser(id, user) {
    if (user.password)
        user.password = bcrypt.hashSync(user.password, 12);
    try {
        const connection = await connect();
        const objectId = new ObjectId(id);
        return connection
            .collection("users")
            .updateOne({ _id: objectId }, { $set: user });
    } catch (error) {
        console.error("Erro ao atualizar o usuário:", error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const connection = await connect();
        const objectId = new ObjectId(id);
        return connection
            .collection("users")
            .deleteOne({ _id: objectId });
    } catch (error) {
        console.error("Erro ao deletar o usuário:", error);
        throw error;
    }
}


module.exports = {
    PAGE_SIZE,
    findCustomers,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    findCustomer,
    countCustomers,
    findUsers,
    insertUser,
    updateUser,
    deleteUser,
    findUser,
    countUsers,
    connect
};