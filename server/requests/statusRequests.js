const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

// Modules
const User = require("../mongoDB/userModel.js")
const ValidationManager = require("../tools/validation.js")


router.post("/user_status", async (req, res) => {
	const filter = { username: req.body.username };
	let body = req.body

	// Verify request data
	let validation = ValidationManager.validateLoginData(body)
	if (validation.isError) {
		res.status(200).send(validation.errorMessage)
		return
	}

	// Decrypt and search user
	let loginResult = await checkUserStatus(body)
	.then((result) => { res.status(200).send({code: "200", status: result.errorMessage})})
	.catch((err) => { console.log(err); res.status(200).send(err.errorMessage)})
});

async function checkUserStatus(body) {

	const filter = { username: body.username };
	const update = { status: "logged in" };
	let validationResult = {
		isError: false,
		errorMessage: new String()
	}

	let promise = new Promise((resolve, reject) => {
		User.findOneAndUpdate(filter, update)
			.then(user => {

				// Check if user field exists
				if (!user) {
					validationResult.isError = true
					validationResult.errorMessage = "User doesn't exist"
					resolve(validationResult)
					return
				}

				// Compare the crypted passwords
				bcrypt.compare(body.password, user.password, (err, isMatch) => {
					if (err || !isMatch) {
						validationResult.isError = true
						validationResult.errorMessage = "Wrong Password"
						resolve(validationResult)
					}
					resolve(validationResult)
				})

				// Check user's status
				if (user.status == "logged in") 
					validationResult.errorMessage = "Status: " + user.status
				else 
					validationResult.errorMessage = "Status: " + user.status


				validationResult.isError = true
				resolve(validationResult)


			})
			.catch(err => {
				validationResult.isError = true
				validationResult.errorMessage = err
				reject(validationResult)
			})
	})

	let result = await promise;
	return (result)
}



module.exports = router;