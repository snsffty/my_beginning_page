import clientPromise from "../../lib/mongodb"; // 数据库连接逻辑

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { answers } = req.body; // 从请求体中获取填空题的答案数组

    // 验证：确保答案是一个数组且每项不能为空
    if (
      !answers ||
      !Array.isArray(answers) ||
      answers.some((answer) => answer.trim() === "")
    ) {
      return res.status(400).json({ message: "所有答案不能为空！" });
    }

    try {
      // 获取 MongoDB 客户端
      const client = await clientPromise;
      const db = client.db("nextjs-app"); // 替换为你的数据库名称
      const collection = db.collection("answers"); // 替换为你的集合名称

      // 插入答案到数据库
      await collection.insertOne({
        answers, // 填空题的答案数组
        createdAt: new Date(), // 记录提交时间
      });

      // 返回成功响应
      res.status(200).json({ message: "答案已成功保存！" });
    } catch (error) {
      console.error("保存答案时出错:", error);
      res.status(500).json({ message: "保存失败，请稍后再试！" });
    }
  } else {
    // 如果不是 POST 请求，返回 405 错误
    res.status(405).json({ message: "不支持的请求方法！" });
  }
}
