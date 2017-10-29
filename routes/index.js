var express = require('express');
var Handlebars = require('hbs');
var router = express.Router();
var numBingoSquares = 25;
var pageTitle = "Rebecca Sullivan";

router.get('/', function (req, res) {
    res.render('home');
});

router.get('/home', function (req, res) {
    res.render('home');
});

router.get('/topic-du-jour', function (req, res) {
	res.render('topic-du-jour');
});

router.get('/blog', function (req, res) {
    res.render('blog');
});

router.get('/coding-projects', function(req, res) {
	res.render('coding-projects');
});

router.get('/mba-projects', function(req, res) {
	res.render('mba-projects');
});

router.get('/tech-resume', function(req, res) {
	res.render('tech-resume');
});

router.get('/teaching-resume', function(req, res) {
	res.render('teaching-resume');
});

router.get('/etc', function(req, res) {
	res.render('etc');
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

/*
app.use('/', (req, res, next) => {
	res.locals.year = new Date().getFullYear();
	next();
})
// Home
app.get('/', (req, res) => {
  Cosmic.getObjects({ bucket: { slug: bucket_slug, read_key: read_key } }, (err, response) => {
    const cosmic = response
    if (cosmic.objects.type.posts) {
      cosmic.objects.type.posts.forEach(post => {
        const friendly_date = helpers.friendlyDate(new Date(post.created_at))
        post.friendly_date = friendly_date.month + ' ' + friendly_date.date
      })
    } else {
      cosmic.no_posts = true
    }
    res.locals.cosmic = cosmic
    res.render('index.html', { partials })
  })
})*/

module.exports = router; 
