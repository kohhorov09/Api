import fs from "fs-extra";
import path from "path";

const dbPath = path.resolve("data", "db.json");

export default async function handler(req, res) {
  await fs.ensureFile(dbPath);
  let db = await fs.readJson(dbPath).catch(() => ({ missions: [] }));

  if (req.method === "GET") {
    return res.status(200).json(db.missions);
  }

  if (req.method === "POST") {
    const newMission = req.body;
    newMission.id = Date.now();
    db.missions.push(newMission);
    await fs.writeJson(dbPath, db);
    return res.status(201).json(newMission);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    db.missions = db.missions.filter((m) => m.id !== parseInt(id));
    await fs.writeJson(dbPath, db);
    return res.status(200).json({ success: true });
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const updatedMission = req.body;
    db.missions = db.missions.map((m) =>
      m.id === parseInt(id) ? { ...m, ...updatedMission } : m
    );
    await fs.writeJson(dbPath, db);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
