// Invalid absolute import for a component in the same feature
// Should use relative import
import { LoginButton } from "features/auth/ui/LoginButton";

// Invalid relative import from another layer
// Should use absolute import
import { addCommentFormActions } from "widgets/TheHeader"; // error: should relative
// Valid imports
import { Button } from "shared/ui/Button";
import { Input } from "shared/ui/Input";

export const LoginForm = () => {
	return (
		<form>
			<Input type="text" placeholder="Username" />
			<Input type="password" placeholder="Password" />
			<LoginButton onClick={() => addCommentFormActions}>Login</LoginButton>
			<Button>Cancel</Button>
		</form>
	);
};
