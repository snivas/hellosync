var express = require('express');
var router = express.Router();

/* GET  listing. */
router.get('/', function(req, res) {
	  res.render('index', {
	    title: 'Hello AppZui'
	  });
});

router.get('/states/:lightid', function(req, res) {
	var db = req.db;
	var lightid = req.params.lightid;
	console.log("Get " + lightid);
	db.state.find({_id : lightid}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/history', function(req, res) {
	var db = req.db;
	db.history.find({},{"limit": 10}).sort( { timestp: -1 } ).toArray(function (err, items) {
        res.json(items);
    });
});


module.exports = router;