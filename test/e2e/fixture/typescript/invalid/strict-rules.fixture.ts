class StrictRuleService {
	public handle(): void {}
}

const service = new StrictRuleService();
const handler = service.handle;
const retryCount = 2;

function getRetryLimit(): number {
	return 2;
}

export { getRetryLimit, handler, retryCount };
