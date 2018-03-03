var app = require('../app');
var express = require('express');
var Handlebars = require('hbs');
var router = express.Router();
var pageTitle = "Rebecca Sullivan";
var request = require('superagent');
var contentful = require('contentful');
var config = require('../package.json').config || {};
var marked = require('marked');
var redis = require('redis');
var bodyParser = require('body-parser');

var redisClient = redis.createClient(process.env.REDIS_URL);
var contentfulBlogKey = 'contentful-blog-posts';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/*
router.get('/beta/bingo', function(req, res) {
  // var server = req.connection.server;
  // var io = require('socket.io')(server);

  var socket = new WebSocket('ws://localhost:3000');
  socket.onopen = function(event) {
    var $testDiv = $('#test');

    $testDiv.innerHTML = 'Connected to: ' + event.currentTarget.url;
    $testDiv.className = 'open';
  };

  socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
  });
  res.render('test-socketio');
});
*/

// Basic GET routes for all pages
router.get('/', function (req, res) {
    res.render('home');
})

router.get('/home', function (req, res) {
    res.render('home');
})

router.get('/topic-du-jour', function (req, res) {
	res.render('topic-du-jour');
})

router.get('/coding-projects', function(req, res) {
	res.render('coding-projects');
})

router.get('/mba-projects', function(req, res) {
	res.render('mba-projects');
})

router.get('/tech-resume', function(req, res) {
	res.render('tech-resume');
})

router.get('/teaching-resume', function(req, res) {
	res.render('teaching-resume');
})

router.get('/summit-food-coalition', function(req, res) {
  res.render('summit-food-coalition');
})

router.get('/etc', function(req, res) {
	res.render('etc');
});

// Redis cache for Contentful API calls
function cache(req, res, next) {
    console.log('In cache function in index.js');

    redisClient.get(contentfulBlogKey, function (err, entries) {
        if (entries != null) {
            var jsonEntries = JSON.parse(entries);

            var tags = new Set();
            var blogPosts = [];
        		jsonEntries.items.forEach(function (entry) {
        			blogPosts.push(entry);
        			entry.fields.tags.forEach(function (tag) {
        				tags.add(tag);
        			});
        	  });

        		var tagArray = Array.from(tags);
            console.log(tagArray);

            res.render('blog', {
                blogPosts: blogPosts,
                tags: tagArray
            });
        } else {
            next();
        }
    });
}

function getContentfulClient() {
  return contentful.createClient({
    accessToken: config.accessToken,
    space: config.space
  });
}

function getBlogPosts(req, res, next) {
  console.log('in getBlogPosts function in index.js');
  var contentfulClient = getContentfulClient();

	// Get all Contentful entries
	contentfulClient.getEntries({
		content_type: 'blogPost',
		order: '-sys.createdAt'
	}).then(function (entries) {

    var blogPosts = [];
    var tags = new Set();

		entries.items.forEach(function (entry) {
			blogPosts.push(entry);
			entry.fields.tags.forEach(function (tag) {
				tags.add(tag);
			});
	  });

		let tagArray = Array.from(tags);
    var jsonStringEntries = JSON.stringify(entries);

    // Set cache entry with all blog entries
    redisClient.setex(contentfulBlogKey, 60, jsonStringEntries);

    // Send entries to handlebars template to display
	  res.render('blog', {
	  		blogPosts: blogPosts,
			  tags: tagArray
	  });
	});
}

// Blog Routes
router.get('/blog', cache, getBlogPosts);

router.get('/search', function(req, res) {
  var searchText = req.query.searchText;
  console.log('Search text: ' + searchText);

  var contentfulClient = getContentfulClient();
  contentfulClient.getEntries({
    'query': searchText
  })
  .then(function (entries) {
    console.log('entries.items: ' + entries.items);
    console.log('entries.items.length: ' + entries.items.length);
    var blogPosts = [];
    var tags = new Set();

		entries.items.forEach(function (entry) {
			blogPosts.push(entry);
			entry.fields.tags.forEach(function (tag) {
				tags.add(tag);
			});
	  });

		let tagArray = Array.from(tags);
    res.render('search', {
	  		blogPosts: blogPosts,
			  tags: tagArray
	  });
  }).catch(function (reason) {
    console.log(reason);
  });
});

router.get('/blog/:postId/:entrySlug', function (req, res) {
	// Make API call to search for blog post
	var entrySlug = req.params.entrySlug;
	var postId = req.params.postId;

  var contentfulClient = getContentfulClient();

  contentfulClient.getEntry(postId)
    .then(function (entry) {
    		entry.bodyHtml = marked(entry.fields.bodyCopy);

        var photoId = entry.fields.photo.sys.id;
        var url;

        contentfulClient.getAsset(photoId)
          .then((asset) => {
            url = `https:${asset.fields.file.url}`;

            // Render blog layout with specific blog post elements
            res.render('blog-post', {
              imageUrl: url,
              post: entry
            });
          });
	});
});

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
  		});
    });
});

router.get('/buzzwords', function (req, res) {
  var numBuzzwords = req.query.number;
  var bingoSquares = [];

  req.database.each('SELECT id, square_text FROM bingo_squares ORDER BY RANDOM() LIMIT ' + numBuzzwords + ';', function (err, row) {
      if (err) {
          console.error(err.message)
      } else {
		      bingoSquares.push(row)
      }
  }, function onComplete(err, rowsReturned) {
		    res.send(bingoSquares);
  });
});

router.get('/bingo-games', function (req, res) {
  res.render('bingo-games');
});

/*
io.on('connection', function(socket){
  console.log('a user connected');
});
*/
// Handlebars helper for basic for loop
Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

module.exports = router
