var express = require('express');
var Handlebars = require('hbs');
var router = express.Router();
var pageTitle = "Rebecca Sullivan";
var request = require('superagent');
var Cosmic = require('cosmicjs');
var contentful = require('contentful');
var config = require('../package.json').config || {};
var marked = require('marked');
var redis = require('redis');
var REDIS_PORT = process.env.REDIS_PORT;

var redisClient = redis.createClient(REDIS_PORT);
var contentfulBlogKey = 'contentful-blog-posts';

// Basic GET routes for all pages
router.get('/', function (req, res) {
    res.render('home')
})

router.get('/home', function (req, res) {
    res.render('home')
})

router.get('/topic-du-jour', function (req, res) {
	res.render('topic-du-jour')
})

router.get('/coding-projects', function(req, res) {
	res.render('coding-projects')
})

router.get('/mba-projects', function(req, res) {
	res.render('mba-projects')
})

router.get('/tech-resume', function(req, res) {
	res.render('tech-resume')
})

router.get('/teaching-resume', function(req, res) {
	res.render('teaching-resume')
})

router.get('/summit-food-coalition', function(req, res) {
  res.render('summit-food-coalition')
})

router.get('/etc', function(req, res) {
	res.render('etc')
});

function cache(req, res, next) {
    redisClient.get(contentfulBlogKey, function (err, data) {
        if (data != null) {
            res.render('blog', {
                blogPosts: data.entries,
                tags: data.tags
              });
        } else {
            next();
        }
    });
}

function getBlogPosts(req, res, next) {
  // Get Contentful client
  var contentfulClient = contentful.createClient({
    accessToken: config.accessToken,
    space: config.space
  });

  var blogPosts = [];

	// Get all Contentful entries
	contentfulClient.getEntries({
		content_type: 'blogPost',
		order: '-sys.createdAt'
	}).then(function (entries) {

    var tags = new Set();

		entries.items.forEach(function (entry) {
			blogPosts.push(entry);
			entry.fields.tags.forEach(function (tag) {
				tags.add(tag);
			});
	  });

		let tagArray = Array.from(tags);

    client.setex(contentfulBlogKey, 172800, entries);

    // Send entries to handlebars template to display
	  res.render('blog', {
	  		blogPosts: blogPosts,
			  tags: tagArray
	  });
	});
}

// Blog Routes
router.get('/blog', cache, getBlogPosts);

router.get('/blog/:postId/:entrySlug', function (req, res) {
	// Make API call to search for blog post
	var entrySlug = req.params.entrySlug;
	var postId = req.params.postId;

	client.getEntry(postId).then(function (entry) {
		entry.bodyHtml = marked(entry.fields.bodyCopy)

		// Render blog layout with specific blog post elements
		res.render('blog-post', {
			post: entry
		})
	})
})

// Logic for getting seed data for Bingo Squares from SQLite
router.get('/bingo-squares', function (req, res) {
	var bingoSquares = [];
    req.database.each('SELECT id, square_text FROM bingo_squares ORDER BY RANDOM() LIMIT 25;', function (err, row) {
        if (err) {
            console.error(err.message)
        } else {
			bingoSquares.push(row)
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned)

		res.render('bingo', {
			title: pageTitle,
			squares: bingoSquares
		})
    })
})

// Handlebars helper to group bingo squares in sets of 5 for rows
Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext)
                subcontext = []
            }
            subcontext.push(context[i])
        }
        out += options.fn(subcontext)
    }
    return out
})

module.exports = router
