const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


const User = require("../mongoDB/userModel.js")
const ValidationManager = require("../tools/validation.js")

router.post("/register_user", async (req, res) => {
	// Parse request Data
	let body = req.body

	let validation = ValidationManager.validateRegisterData(body)
	if (validation.isError) {
		res.status(200).send(validation.errorMessage)
		return
	}

	// Encrypt and create user
	const hash = await bcrypt.hash(body.password, 10);
	const user = new User({ username: body.username, password: hash, group: getGroup(body)});

	// Save user and answer request
	await user.save().catch((err) => res.status(200).send(err))

	res.status(200).send({ code: "200", status: "Register Succesfull"})

});


function getGroup(body) {
	if (body.group)
		if (body.group !== "")
			return body.group

	return "user"
}


module.exports = router;