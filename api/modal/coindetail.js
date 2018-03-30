const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const coinDetailSchema = new mongoose.Schema({
		userID:{ type: String ,default: null },
		tokenCounter:{ type: Number ,default: '0' },
		usdCounter:{ type: Number ,default:'0'},
		btcCounter:{ type: Number ,default:'0'},
		ethCounter:{ type: Number ,default: '0'},
		priceInUsd:{ type: Number , default: '1'},
		created:{type: Date, default: Date.now},
});

var coinDetail = mongoose.model('coinDetail', coinDetailSchema);
module.exports = coinDetail;
