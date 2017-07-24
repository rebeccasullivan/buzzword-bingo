var express = require('express');
var Handlebars = require('hbs');
var router = express.Router();
var numBingoSquares = 25;
var pageTitle = "Buzzword Bingo Generator";

router.get('/', function (req, res) {
    res.redirect('/bingo-squares')
});

router.get('/bingo-squares', function (req, res) {
	var bingoSquares = [];
    req.database.each('SELECT id, square_text FROM bingo_squares ORDER BY RANDOM() LIMIT 25;', function (err, row) {
        if (err) {
            console.error(err.message);
        } else {
			bingoSquares.push(row);
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned);
		
		res.render('bingo', {
			title: pageTitle,
			squares: bingoSquares
		});
    });
});

router.get('/bingo-refresh', function (req, res) {
	var bingoSquares = [];
    req.database.each('SELECT id, square_text FROM bingo_squares ORDER BY RANDOM() LIMIT 25;', function (err, row) {
        if (err) {
            console.error(err.message);
        } else {
			bingoSquares.push(row);
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned);
		
		res.render('bingoRefresh', {
			title: pageTitle,
			squares: bingoSquares
		});
    });
});


Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

module.exports = router;
