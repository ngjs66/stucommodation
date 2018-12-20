let mongoose = require('mongoose');

let HostelSchema = new mongoose.Schema({
        id: Number,
        hosteltype: String,
        distance: Number,
        cost: Number,
        thumbsup:{type: Number, default: 0}
    },
    { collection: 'hostels' });

module.exports = mongoose.model('Hostel', HostelSchema);