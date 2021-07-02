const mongoose = require('mongoose');

const Individual = new mongoose.schema
({
	email: {
		type: String,
		required: true
	}
	password: {
		type: String,
		required: true
	}
	display_name: {
		type: String
	}
	individual_category: {
		type: String
	}
	description: {
		type: String
	}
	candidate_group_categories: [
		{
			group_category: {
				type: String
			}
		}
	]
	ready_status: {
		type: int,
		required: true
	}
	groups: [
		{
			email: {
				type: String
			}
			status: {
				type: int
			}
		}
	]
});

module.exports = mongoose.model('Individual', Individual);
