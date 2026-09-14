// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function generateProjectSummary(tasks, notes) {
//   const prompt = `
// তুমি একজন অভিজ্ঞ project manager assistant। নিচে একটা project-এর
// task list এবং notes দেওয়া আছে। এর ভিত্তিতে একটা সংক্ষিপ্ত weekly
// summary লিখো — কী কী শেষ হয়েছে, কী চলছে, আর কোথাও blocker আছে কিনা।

// Tasks:
// ${tasks.map(t => - [${t.status}] ${t.title}: ${t.description || "no description"}).join("\n")}

// Notes:
// ${notes.map(n => - ${n.title}: ${n.content}).join("\n")}

// Summary format:
// 1. Completed this period
// 2. In progress
// 3. Potential blockers / risks
// Keep it under 150 words.
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",   // fast + cheap, summary-এর জন্য যথেষ্ট
//     contents: prompt,
//   });

//   return response.text;
// }

// export async function suggestTaskPriority(taskTitle, taskDescription) {
//   const prompt = `
// নিচের task-টা দেখে এটার priority suggest করো (High/Medium/Low),
// এবং এক লাইনে কারণ লিখো। শুধু JSON format এ উত্তর দাও, অন্য কিছু না:

// {"priority": "High" | "Medium" | "Low", "reason": "..."}

// Task title: ${taskTitle}
// Description: ${taskDescription || "none"}
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   const clean = response.text.replace(/```json|```/g, "").trim();
//   return JSON.parse(clean);
// }
// import { generateProjectSummary, suggestTaskPriority } from "../services/ai.service.js";
// import prisma from "../lib/prisma.js";

// export async function getProjectSummary(req, res) {
//   try {
//     const { projectId } = req.params;

//     const tasks = await prisma.task.findMany({
//       where: { sprint: { projectId } },
//       select: { title: true, description: true, status: true },
//     });

//     const notes = await prisma.note.findMany({
//       where: { projectId },
//       select: { title: true, content: true },
//     });

//     const summary = await generateProjectSummary(tasks, notes);
//     res.json({ summary });
//   } catch (err) {
//     console.error("AI summary error:", err);
//     res.status(500).json({ error: "Failed to generate summary" });
//   }
// }

// export async function getTaskPrioritySuggestion(req, res) {
//   try {
//     const { taskId } = req.params;
//     const task = await prisma.task.findUnique({ where: { id: taskId } });

//     if (!task) return res.status(404).json({ error: "Task not found" });

//     const result = await suggestTaskPriority(task.title, task.description);
//     res.json(result);
//   } catch (err) {
//     console.error("AI priority error:", err);
//     res.status(500).json({ error: "Failed to suggest priority" });
//   }
// }
// router.post("/ai/summary/:projectId", authMiddleware, getProjectSummary);
// router.post("/ai/suggest-priority/:taskId", authMiddleware, getTaskPrioritySuggestion);
