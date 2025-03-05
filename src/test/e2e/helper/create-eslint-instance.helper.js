import { ESLint } from "eslint";
import createConfig from "../../../../dist/esm/index";
export async function createEsLintInstance(options) {
    const config = await createConfig(options);
    return new ESLint({
        baseConfig: config,
        overrideConfigFile: true,
    });
}
