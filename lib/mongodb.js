import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // 从环境变量中读取 MongoDB 连接字符串
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("请在 .env.local 文件中添加 MONGODB_URI 环境变量");
}

if (process.env.NODE_ENV === "development") {
  // 在开发模式下复用全局 MongoClient 实例
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 在生产模式下每次创建新的 MongoClient 实例
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
