import { rootStore } from "../store/root-store";

export function StoreProvider({ children }) {
	return <div data-store={rootStore}>{children}</div>;
}
