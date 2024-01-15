const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    previous:{
        type: Number,
        default: 0
    },
    current: {
        type: Number,
        default: 0
    },
    change: {
        type: Number,
        default: 0
    }
});

const Change = mongoose.model('change', changeSchema);

module.exports = Change;
