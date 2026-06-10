import ReactMarkdown from "react-markdown";
import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/chat",
        {
          message,
        }
      );

      setChat((prevChat) => [
        ...prevChat,
        {
          role: "user",
          text: message,
        },
        {
          role: "assistant",
          text: res.data.reply,
        },
      ]);

      setMessage("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>AI Interview Coach</h1>

      <textarea
        rows="5"
        cols="50"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {
            e.preventDefault();
            handleClick();
          }
        }}
        placeholder="Ask your interview question..."
      />

      <br />
      <br />

      <button
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <button
        onClick={() => setChat([])}
        style={{
          marginLeft: "10px",
        }}
      >
        Clear Chat
      </button>

      <button
        onClick={() =>
          setMessage(
            "Start Mock Interview"
          )
        }
        style={{
          marginLeft: "10px",
        }}
      >
        🎤 Mock Interview
      </button>

      <h3>Chat</h3>

      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          marginTop: "20px",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              background:
                msg.role === "user"
                  ? "#1e3a8a"
                  : "#1f2937",
              color: "white",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <strong>
              {msg.role === "user"
                ? "🧑 You"
                : "🤖 AI Coach"}
            </strong>

            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;