import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_FSD_CASES: Array<IRuleBehaviorCase> = [
	createCase("fsd", "fsd/no-public-api-sidestep", { withFsd: true }, "src/features/comments/ui/comment-list.jsx", `import { addCommentFormReducer } from "@entities/article/model/slice";\nexport const reducer = addCommentFormReducer;\n`),
	createCase("fsd", "fsd/no-relative-imports", { withFsd: true }, "src/features/auth/model/service.js", `import { store } from "../../../app/store";\nexport const service = store;\n`),
	createCase("fsd", "@conarti/feature-sliced/no-cross-segment-reexport", { withFsd: true }, "src/entities/user/model/index.js", `export { UserCard } from "../ui/user-card";\n`),
	createCase("fsd", "fsd/forbidden-imports", { withFsd: true }, "src/features/auth/model/service.js", `import { LoginPage } from "@pages/login";\nexport const service = LoginPage;\n`),
	createCase("fsd", "fsd/no-cross-slice-dependency", { withFsd: true }, "src/features/auth/model/service.js", `import { profileService } from "@features/profile/model/service";\nexport const service = profileService;\n`),
	createCase("fsd", "fsd/no-global-store-imports", { withFsd: true }, "src/features/auth/model/service.js", `import { store } from "@/app/store";\nexport const service = store;\n`),
	createCase("fsd", "fsd/no-ui-in-business-logic", { withFsd: true }, "src/entities/user/model/user.js", `import { UserCard } from "@entities/user/ui/user-card";\nexport const model = UserCard;\n`, "not-reported"),
	createCase("fsd", "fsd/ordered-imports", { withFsd: true }, "src/features/auth/model/service.js", `import { processPayment } from "@features/payment";\nimport { getUser } from "@entities/user";\nimport { formatCurrency } from "@shared/lib/currency";\nimport { providers } from "@app/providers";\nexport const service = [processPayment, getUser, formatCurrency, providers];\n`),
];
