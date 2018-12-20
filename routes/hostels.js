let Hostel = require('../models/hostels');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

var mongodbUri ='mongodb://20069422:YZQREF5nw@ds145053.mlab.com:45053/hostelsdb';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.findAllHostels = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Hostel.find(function(err, hostels) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(hostels,null,5));
    });
};

router.findHostel = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Hostel.find({ "_id" : req.params.id },function(err, hostel) {
        if (err)
            res.send('Error! Hostel NOT Found!!');
        else
            res.send(JSON.stringify(hostel,null,5));
    });
};

router.addHostel = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var hostel = new Hostel();

    hostel._id = req.params.id;
    hostel.hosteltype = req.body.hosteltype; // request hostel type (apartment/house)
    hostel.distance = req.body.distance; // request distance from college
    hostel.cost = req.body.cost; // request rental cost
    hostel.thumbsup = req.body.thumbsup; // request the amount of likes

    hostel.save(function(err) {
        if (err)
            res.json({ message: 'Sorry! Hostel NOT Added!'});
        else
            res.json({ message: 'Hostel Added Successfully!'});
    });
};

router.incrementThumbsUp = (req, res) => {

    Hostel.findById(req.params.id, function(err,hostel) {
        if (err)
            res.json({ message: 'Error! Hostel NOT Found!!', errmsg : err } );
        else {
            hostel.thumbsup += 1;
            hostel.save(function (err) {
                if (err)
                    res.json({ message: 'UNSUCCESSFUL Thumbs Up!!!', errmsg : err } );
                else
                    res.json({ message: 'Thumbs Up successfully added to Hostel!', data: hostel});
            });
        }
    });
};

router.deleteHostel = (req, res) => {

    Hostel.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Hostel NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Hostel Successfully Deleted!'});
    });
};

router.findTotalThumbsUp = (req, res) => {

    Hostel.find(function(err, hostels) {
        if (err)
            res.send(err);
        else
            res.json({ totalthumbsup : getTotalThumbsUp(hostels) });
    });
};

function getTotalThumbsUp(array) {
    let totalThumbsUp = 0;
    array.forEach(function(obj) { totalThumbsUp += obj.thumbsup; });
    return totalThumbsUp;
}

module.exports = router;