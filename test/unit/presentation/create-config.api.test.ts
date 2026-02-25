import type { IConfigOptions } from "@domain/interface";

import { beforeEach, describe, expect, it, vi } from "vitest";

const resolveMock = vi.fn();
const createContainerMock = vi.fn(() => ({
	resolve: resolveMock,
}));

vi.mock("@presentation/composition-root/create-container", () => ({
	createContainer: createContainerMock,
}));

vi.mock("@presentation/token", () => ({
	CREATE_ESLINT_CONFIG_USE_CASE_TOKEN: Symbol("CREATE_ESLINT_CONFIG_USE_CASE_TOKEN"),
}));

describe("CreateConfigApi", () => {
	beforeEach(() => {
		resolveMock.mockReset();
		createContainerMock.mockClear();
	});

	it("should resolve use case from container and execute it", async () => {
		const executeMock = vi.fn().mockResolvedValue([{ rules: {} }]);
		resolveMock.mockReturnValue({ execute: executeMock });

		const { createConfigFromApi, resetConfigContainerForTests } = await import("@presentation/api/create-config.api");
		resetConfigContainerForTests();

		const options: IConfigOptions = { withJavascript: true };
		const result = await createConfigFromApi(options);

		expect(createContainerMock).toHaveBeenCalledTimes(1);
		expect(executeMock).toHaveBeenCalledWith(options);
		expect(result).toEqual([{ rules: {} }]);
	});

	it("should cache container between calls", async () => {
		const executeMock = vi.fn().mockResolvedValue([]);
		resolveMock.mockReturnValue({ execute: executeMock });

		const { createConfigFromApi, resetConfigContainerForTests } = await import("@presentation/api/create-config.api");
		resetConfigContainerForTests();

		await createConfigFromApi({});
		await createConfigFromApi({});

		expect(createContainerMock).toHaveBeenCalledTimes(1);
		expect(executeMock).toHaveBeenCalledTimes(2);
	});
});
