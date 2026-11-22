declare function loadUser(id: string): { id: string };

const users = new Map<string, { id: string }>();

export const user = users.getOrInsert("1", loadUser("1"));
