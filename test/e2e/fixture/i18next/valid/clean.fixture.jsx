import React from "react";
import { useTranslation } from "react-i18next";

// Valid component using translations
export function WelcomeMessage({ username }) {
	const { t } = useTranslation();

	return (
		<div className="welcome-container">
			<h1>{t("welcome.title")}</h1>
			<p>{t("welcome.greeting", { username })}</p>
			<a href="/dashboard" className="btn-primary">
				{t("welcome.action.continue")}
			</a>
		</div>
	);
}

// Using Trans component is also valid
export function TermsAndConditions() {
	return (
		<div>
			<Trans i18nKey="terms.conditions">
				By continuing, you agree to our <a href="/terms">Terms of Service</a>.
			</Trans>
		</div>
	);
}

// Technical attributes don't need to be translated
export function TechnicalComponent() {
	return (
		<div id="main-container" data-testid="welcome-screen" className="wrapper">
			<input type="text" name="username" />
		</div>
	);
}
