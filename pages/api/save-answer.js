import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "无效的答案格式！" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("hhh"); // 替换为你的数据库名称
      const collection = db.collection("answer"); // 替换为你的集合名称

      // 插入答案到数据库
      await collection.insertOne({ answers, createdAt: new Date() });

      res.status(200).json({ message: "答案已保存！" });
    } catch (error) {
      console.error("保存答案时出错:", error);
      res.status(500).json({ message: "服务器错误，请稍后再试！" });
    }
  } else {
    res.status(405).json({ message: "不支持的请求方法！" });
  }
}
