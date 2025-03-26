import React from "react";

// Invalid component with literal strings that should be translated
export function ErrorMessage({ code }) {
	return (
		<div className="error-container">
			{/* These literal strings should be translated */}
			<h1>An error occurred</h1>
			<p>We are sorry, but something went wrong.</p>
			<p>Error code: {code}</p>
			<button>Try again</button>
		</div>
	);
}

// Even with some text in attributes, the component text should be translated
export function ContactForm() {
	return (
		<form className="contact-form" data-testid="contact-form">
			{/* The form field labels should be translated */}
			<label>Your Name</label>
			<input type="text" name="name" />

			<label>Email Address</label>
			<input type="email" name="email" />

			<label>Message</label>
			<textarea name="message"></textarea>

			<button type="submit">Send Message</button>
		</form>
	);
}
