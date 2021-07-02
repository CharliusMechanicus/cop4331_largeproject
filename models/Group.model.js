const mongoose = require('mongoose');

const Group = new mongoose.schema
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
	group_category: {
		type: String
	}
	description: {
		type: String
	}
	candidate_individual_categories: [
		{
			individual_category: {
				type: String
			}
		}
	]
	ready_status: {
		type: int,
		required: true
	}
	individuals: [
		{
			email: {
				type: String
			},
			status: {
				type: int
			}
		}
	]
});

module.exports = mongoose.model('Group', Group);
