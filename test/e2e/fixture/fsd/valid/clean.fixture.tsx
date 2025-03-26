import { Article } from "entities/Article";
import { Button } from "shared/ui/Button";
import { SearchForm } from "./ui/SearchForm";

export const SearchArticles = () => {
	return (
		<div>
			<SearchForm />
			<Button>Search</Button>
			<Article />
		</div>
	);
};
