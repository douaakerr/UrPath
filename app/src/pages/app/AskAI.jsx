import { useState } from "react";
import { ArrowUp, Bot, User } from "lucide-react";
import { sendLearningChat } from "../../services/aiService";
import "../../style/ask-ai.css";

function AskAI() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [context, setContext] = useState({ domain:"", subdomain:"", goal:"", level:"", courseTitle:"", lessonTitle:"", lessonContent:"" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setMessages((current) => [...current, { role:"user", text }]);
    setMessage(""); setSending(true); setError("");
    try {
      const response = await sendLearningChat({ ...context, message:text });
      const answer = response?.answer || response?.data?.answer;
      setMessages((current) => [...current, { role:"assistant", text:answer || "I couldn't generate an answer." }]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reach the learning assistant.");
    } finally { setSending(false); }
  };

  return <main className="ask-ai-page">
    <header className="ask-ai-header"><span>LEARNING ASSISTANT</span><h1>Ask UrPath</h1><p>Ask questions about the course and lesson you are studying.</p></header>
    <section className="ask-ai-card">
      <div className="ask-ai-context">
        <input placeholder="Course title" value={context.courseTitle} onChange={e=>setContext({...context,courseTitle:e.target.value})}/>
        <input placeholder="Lesson title" value={context.lessonTitle} onChange={e=>setContext({...context,lessonTitle:e.target.value})}/>
      </div>
      <div className="ask-ai-messages">
        {messages.length===0 && <div className="ask-ai-empty"><Bot size={30}/><h2>What are you learning?</h2><p>Add the course and lesson above, then ask a question.</p></div>}
        {messages.map((item,index)=><div className={`ask-ai-message ask-ai-message--${item.role}`} key={index}><span className="ask-ai-message__icon">{item.role==="user"?<User size={15}/>:<Bot size={15}/>}</span><p>{item.text}</p></div>)}
        {sending && <div className="ask-ai-typing">Thinking…</div>}
      </div>
      <form className="ask-ai-input" onSubmit={send}><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about this lesson..." rows={2}/><button disabled={sending || !message.trim()}><ArrowUp size={18}/></button></form>
      {error && <p className="ask-ai-error">{error}</p>}
    </section>
  </main>;
}
export default AskAI;
