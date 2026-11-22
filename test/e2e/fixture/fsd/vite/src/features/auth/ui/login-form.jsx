import { UserCard } from "@/entities/user";
import { apiClient } from "@/shared/api";
import { formatDate } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";

export function LoginForm() {
	return (
		<form data-client={apiClient} data-date={formatDate(0)}>
			<UserCard />
			<Button />
		</form>
	);
}
