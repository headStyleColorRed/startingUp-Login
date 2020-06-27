const express = require("express")
const router = express.Router()

// Modules
const User = require("../mongoDB/userModel.js")
const ValidationManager = require("../tools/validation.js")


router.post("/logout_user", async (req, res) => {
	const filter = { username: req.body.username };
	const update = { status: "logged out" };
	let body = req.body

	// Verify request data
	let validation = ValidationManager.validateLoginData(body)
	if (validation.isError) {
		res.status(200).send(validation.errorMessage)
		return
	}

	// Decrypt and compare user
	let logoutResult = await User.findOneAndUpdate(filter, update).catch((err) => res.status(200).send(err))
	
	res.status(200).send({code: "200", status:"Logout Succesfull"})
});



module.exports = router;