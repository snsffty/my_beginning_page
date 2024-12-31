import { useState } from "react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 阶段管理：0=显示文本，1=显示填空题，2=完成
  const [textIndex, setTextIndex] = useState(0); // 当前文本索引
  const [answers, setAnswers] = useState(["", "", ""]); // 填空答案
  const [error, setError] = useState(""); // 错误提示信息

  // 文本内容
  const texts = [
    "你好啊，哈哈哈！",
    "这是用Chatgpt制作的啦。",
    "当然是祝你新年快乐了。",
    "后面有三个问题，可以拜托您至少回答一个吗！",
  ];

  // 填空题
  const questions = [
    "存在和虚无的关系是怎样的(不做填0)：",
    "猜猜我是谁(不做填0)：",
    "可以也祝我新年快乐吗(不做填0)：",
  ];

  // 切换到下一段文本或填空题阶段
  const handleNextText = () => {
    if (textIndex < texts.length - 1) {
      setTextIndex((prev) => prev + 1); // 切换到下一段文本
    } else {
      setCurrentStep(1); // 切换到填空题阶段
    }
  };

  // 更新填空答案
  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // 提交答案
  const handleSubmit = async () => {
    // 验证答案是否填写完整
    if (answers.some((answer) => answer.trim() === "")) {
      setError("所有填空题不能为空，请检查后再提交！");
      return;
    }

    setError(""); // 清空错误提示

    try {
      // 发送数据到服务器
      const response = await fetch("/api/save-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        alert("感谢参与！");
        setAnswers(["", "", ""]); // 清空填空答案
        setCurrentStep(2); // 切换到完成阶段
      } else {
        alert("坏了，网络不好可以再重试一下吗？");
      }
    } catch (error) {
      console.error("提交答案时出错:", error);
      alert("发生错误，请稍后再试！");
    }
  };

  return (
    <div style={styles.container}>
      {currentStep === 0 && (
        // 显示文本阶段
        <div>
          <p style={styles.text}>{texts[textIndex]}</p>
          <button onClick={handleNextText} style={styles.button}>
            {textIndex < texts.length - 1 ? "下一句" : "进入填空题"}
          </button>
        </div>
      )}

      {currentStep === 1 && (
        // 填空题阶段
        <div>
          <h1 style={styles.heading}>请回答以下问题：</h1>
          {questions.map((question, index) => (
            <div key={index} style={styles.questionContainer}>
              <label style={styles.label}>{question}</label>
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={styles.input}
                placeholder="请输入..."
              />
            </div>
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handleSubmit} style={styles.button}>
            好的就这样
          </button>
        </div>
      )}

      {currentStep === 2 && (
        // 完成阶段
        <div>
          <h1 style={styles.heading}>晚安！</h1>
          <p style={styles.text}>睡个好觉吧！</p>
        </div>
      )}
    </div>
  );
}

// 简单的样式
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  text: {
    fontSize: "1.2rem",
    color: "#555",
    margin: "10px 0",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
  },
  questionContainer: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "1rem",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  error: {
    color: "red",
    fontSize: "1rem",
    marginTop: "10px",
  },
};
