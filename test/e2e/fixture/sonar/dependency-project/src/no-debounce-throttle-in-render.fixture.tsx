import debounce from "lodash/debounce";

export function Search({ onSearch }: { onSearch: (value: string) => void }) {
	const search = debounce(onSearch, 300);

	return <input onChange={(event) => search(event.target.value)} />;
}
