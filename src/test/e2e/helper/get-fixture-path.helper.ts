import path from "node:path";

export function getFixturePath(...paths: Array<string>): string {
	console.log("CALLED", paths);
	return path.join(__dirname, "../fixture", ...paths);
}
