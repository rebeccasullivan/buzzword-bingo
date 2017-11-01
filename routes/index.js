var express = require('express')
var Handlebars = require('hbs')
var router = express.Router()
var pageTitle = "Rebecca Sullivan"
var Cosmic = require('cosmicjs')
var contentful = require('contentful')
var config = require('../package.json').config || {}
var marked = require('marked')

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

router.get('/etc', function(req, res) {
	res.render('etc')
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


// Get Contentful client
var client = contentful.createClient({
  accessToken: config.accessToken,
  space: config.space
})

// Blog Routes
router.get('/blog', function (req, res) {
	var blogPosts = []
	
	
	// Get all Contentful entries
	client.getEntries({
		content_type: 'blogPost',
		order: '-sys.createdAt'
	}).then(function (entries) {
	 	var tags = new Set()
		
		entries.items.forEach(function (entry) {
			blogPosts.push(entry)
			entry.fields.tags.forEach(function (tag) {
				tags.add(tag)
			})
	  	})
		
		let tagArray = Array.from(tags)
		
		console.log(tags)
		// Send entries to handlebars template to display
	  	res.render('blog', {
	  		blogPosts: blogPosts,
			tags: tagArray
	  	})
	})
})


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
