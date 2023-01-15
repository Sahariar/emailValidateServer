const express = require("express");
const cors = require("cors");
const dns = require("dns");
const emailExistence = require("email-existence");
const port = process.env.PORT || 4000;
const app = express();
const roleData = require("./data/roleEmail.json");
const emailData = require("./data/dispanceEmail.json");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Email validate Tools server is running");
});

// verify mx For Email
app.get("/mx/:email", async (req, res) => {
	const email = req.params.email;
	console.log(email);
	const domain = email.split("@")[1];

	dns.resolve(domain, "MX", function (err, addresses) {
		if (err) {
			console.log("No MX record exists, so email is invalid.");
			res.status(200).send("invalid");
		} else if (addresses && addresses.length > 0) {
			console.log(
				"This MX records exists So I will accept this email as valid."
			);
			const contentData = {
				isValid: "valid",
				addresses: addresses,
			};
			res.status(200).send(contentData);
		} else {
			res.status(200).send("No Query Send");
		}
	});
});

app.get("/validsmtp/:email", async (req, res) => {
	const email = req.params.email;
	emailExistence.check(email, function (error, response) {
		console.log("res: " + response);
		res.status(200).send(response);
	});
});

app.get("/role/:email", async (req, res) => {
	const email = req.params.email;
	const roleName = email.split("@")[0];
	const isRoleFound = roleData.includes(roleName);
	res.status(200).send(isRoleFound);
});

app.get("/temp/:email", async (req, res) => {
	const email = req.params.email;
	const domain = email.split("@")[1];
	const isTempFound = emailData.includes(domain);
	res.status(200).send(isTempFound);
});

app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});
