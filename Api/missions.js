import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(jsonData);

  if (req.method === "GET") {
    res.status(200).json(data.missions);
  } else if (req.method === "POST") {
    const newMission = { id: Date.now(), ...req.body };
    data.missions.push(newMission);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.status(201).json(newMission);
  } else {
    res.status(405).json({ message: "Only GET and POST methods allowed" });
  }
}
