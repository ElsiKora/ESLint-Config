// This file contains high entropy strings that should trigger the no-secrets rule

// High entropy string that resembles an access token or API key
const accessToken = "ZWVTjPQSdhwRgl204Hc51YCsritMIzn8B9UyeX7xu6KkAGqfm3FJ";

// Another high entropy string (AWS access key format)
const awsAccessKey = "AKIAIOSFODNN7EXAMPLE";
const awsSecretKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Function that uses potential secrets
function authenticateUser(username) {
	// Hard-coded JWT token with high entropy
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";

	return {
		user: username,
		authenticated: true,
		token,
	};
}

// Configuration object with secrets
const config = {
	dbConnection: "postgresql://postgres:S3cr3tP4ssw0rd!@localhost:5432/mydb",
	githubToken: "ghp_mzzPQ9LqajkFsUvykoHaSC1SwTtO7g0pPTwU",
};

// Export everything
export { accessToken, awsAccessKey, awsSecretKey, authenticateUser, config };
