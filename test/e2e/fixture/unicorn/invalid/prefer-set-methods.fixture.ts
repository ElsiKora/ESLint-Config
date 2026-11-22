const admins = new Set<string>(["ada"]);
const editors = new Set<string>(["grace"]);

export const staff = new Set([...admins, ...editors]);
