import { useState } from "react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 阶段管理：0=显示文本，1=显示填空题，2=完成
  const [textIndex, setTextIndex] = useState(0); // 当前文本索引
  const [answers, setAnswers] = useState(["", "", ""]); // 填空答案
  const [error, setError] = useState(""); // 错误提示信息

  // 文本内容
  const texts = [
    "欢迎来到这个页面！",
    "这是一个动态文本和填空题的演示。",
    "请按照提示完成后续的填空题。",
    "点击“下一条”查看填空题。",
  ];

  // 填空题
  const questions = [
    "请填写你的名字：",
    "请填写你的年龄：",
    "请填写你的职业：",
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
        alert("答案已成功提交！");
        setAnswers(["", "", ""]); // 清空填空答案
        setCurrentStep(2); // 切换到完成阶段
      } else {
        alert("提交失败，请稍后再试！");
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
            {textIndex < texts.length - 1 ? "下一条" : "进入填空题"}
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
            提交答案
          </button>
        </div>
      )}

      {currentStep === 2 && (
        // 完成阶段
        <div>
          <h1 style={styles.heading}>感谢你的参与！</h1>
          <p style={styles.text}>你的答案已经成功提交。</p>
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
