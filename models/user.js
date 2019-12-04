  
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
	// firstName: {
	// 	type: String,
	// 	required: true
	// },
	// lastName: {
	// 	type: String,
	// 	required: true
	// },
	// discounted: {
	// 	type: Boolean,
	// 	required: true
	// },
	// timedTicket: {
	// 	type: number,
	// 	required: true
	// },
	// money: {
	// 	type: number,
	// 	required: true
	// }
})

module.exports = mongoose.model('User', userSchema)
