import { Header } from "@/widgets/header";
import { LoginForm } from "@/features/auth";
import { UserCard } from "@/entities/user";
import { Button } from "@/shared/ui/button";

export function EditorPage() {
	return (
		<main>
			<Header />
			<LoginForm />
			<UserCard />
			<Button />
		</main>
	);
}
