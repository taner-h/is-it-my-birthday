import Homepage from "@/components/Homepage";
import fs from "fs";
const data = JSON.parse(fs.readFileSync("./final.json", "utf8"));

export default function Home() {
  return <Homepage data={data} />;
}
