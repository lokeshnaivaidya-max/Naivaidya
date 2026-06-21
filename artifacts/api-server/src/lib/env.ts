import path from "node:path";
import dotenv from "dotenv";

const envPaths = [
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath, override: false });
}
