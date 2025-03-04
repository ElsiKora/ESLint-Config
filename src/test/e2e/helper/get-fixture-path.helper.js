import path from "node:path";
export function getFixturePath(...paths) {
    return path.join(__dirname, "../fixture", ...paths);
}
