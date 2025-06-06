import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...req.body, stream: false }),
    });
    if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch from Ollama" });
    }
    const data = await response.json();
    data.response = data.response.replace(/\u003cthink\u003e[\s\S]*?\u003c\/think\u003e/g, '');
    
    if (data.response.length === 0) {
        return res.status(400).json({ error: "Response is empty after filtering <think> blocks" });
    }

    res.json(data);
});
app.post("/api/chat", async (req, res) => {
    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...req.body, stream: false }),
    });
    if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch from Ollama" });
    }
    const data = await response.json();

    res.json(data);
});
app.listen(5000, () => {
  console.log("Ollama proxy running at http://localhost:5000/generate");
});