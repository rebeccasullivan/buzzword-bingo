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
    req.database.each('SELECT id, square_text FROM bingo_squares LIMIT 25;', function (err, row) {
        console.log(row);
        if (err) {
            console.error(err.message);
        } else {
			bingoSquares.push(row);
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned);
		res.render('bingo', {
			title: pageTitle,
			squares: bingoSquares,
			numSquares: rowsReturned
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
router.get('/students/:id', function (req, res) {
    var id = req.params['id'];
    var student = {}
    var sqlGetStudentTestInformation = `SELECT s.id, s.name, s.age, s.grade, a.student_id, a.test_id, a.score, a.date_taken 
                                        FROM students s 
                                        JOIN attempts a ON a.student_id = s.id 
                                        WHERE s.id = $id;`;
    req.database.each(sqlGetStudentTestInformation, {
        $id: id
    }, function (err, row) {
        console.log(row);
        if (err) {
            console.error(err.message);
        } else {
            student.id = row.id;
            student.name = row.name;
            student.age = row.age;
            student.grade = row.grade;
            if (!student.attempts) {
                student.attempts = [];
            }
            var studentInfo = {
                student_id: row.student_id,
                test_id: row.test_id,
                score: row.score,
                date_taken: row.date_taken
            };
            if (!student.attempts.includes(studentInfo)) {
                student.attempts.push(studentInfo);
            }
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned);
        res.json(student);
    });
});

router.get('/tests', function (req, res) {
    var tests = {};
    var sqlGetTestInfo = `SELECT a.test_id, a.date_taken, t.name, t.maxScore, a.student_id, a.score 
                          FROM attempts a 
                          JOIN tests t ON a.test_id = t.id 
                          ORDER BY a.test_id, a.date_taken, a.student_id;`;
    req.database.each(sqlGetTestInfo, function (err, row) {
        console.log(row);
        if (err) {
            console.error(err.message);
        } else {
            if (!tests[row.test_id]) {
                tests[row.test_id] = {
                    name: row.name,
                    maxScore: row.maxScore,
                    scores: {}
                }
            }
            if (!tests[row.test_id].scores[row.date_taken]) {
                tests[row.test_id].scores[row.date_taken] = [];
            }
            tests[row.test_id].scores[row.date_taken].push({
                student_id: row.student_id,
                score: row.score
            });
        }
    }, function onComplete(err, rowsReturned) {
        console.info(rowsReturned);
        res.json(tests);
    });
});
*/

module.exports = router;
