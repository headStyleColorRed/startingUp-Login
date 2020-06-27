// User.model.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "can't be blank"]
	},
	group: {
		type: String,
		default: "user"
	},
	status: {
		type: String,
		default: "logged out" // vs "logged in"
	}
	
});
const User = mongoose.model("User", userSchema);


module.exports = User;