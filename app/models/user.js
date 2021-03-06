var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var bcrypt = require('bcryptjs');

autoIncrement.initialize(mongoose);

// User Schema
var UserSchema = mongoose.Schema({
	email: {
		type: String,
	},
	name: {
		type: String
	},
	password: {
		type: String
	},
	permission:{
		type: String
	}
});


UserSchema.plugin(autoIncrement.plugin,'User');
var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail= function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

