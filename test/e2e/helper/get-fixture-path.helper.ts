import path from "node:path";

export function getFixturePath(...paths: Array<string>): string {
	return path.join(__dirname, "../fixture", ...paths);
}
