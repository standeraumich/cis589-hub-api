var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    let dataArray = [
        {name: "Stob", age: 27},
        {name: "Booga", age: 28},
        {name: "Cronk", age: 100}
    ];

    res.json({
        data: dataArray
    });

});

module.exports = router;
