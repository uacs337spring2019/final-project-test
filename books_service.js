// Allison Obourn
// CSC 337, Spring 2019
// Lecture 16

// this web service outputs all possible categories when passed 
// no parameters. When passed a category parameter
// provides JSON that includes a list of books in that
// category. Each book is a JSON object that contains title, 
// author, year and price. If no books exist in that category outputs 
// a 410 error

const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let params = req.query;
	let cat = params.category;

	let json = "";
	if(cat) {
		json = get_category(cat);
	} else {
		json = get_all();
	}
	res.send(JSON.stringify(json));
	
})

app.listen(process.env.PORT);
	

// returns an object containing a list of all the possible 
// categories that exist
function get_all() {
	let cats = [];

	// go through file and find books 
	let file = fs.readFileSync("books.txt", 'utf8');
	let lines = file.split("\n");
	for(let i = 0; i < lines.length; i++) {
		let contents = lines[i].split("|");
		let cat = contents[2];
		if(!cats.includes(cat)) {
			cats.push(cat);
		}
	}

	let json = {};
	json["categories"] = cats;
	return json;
}

// takes a category name as a parameter.
// returns an object containing information about each of the books 
// in the passed in category. Sets the status to 410 if no books exist.
function get_category(cat) {
	let json = {};
	let books = [];

	// go through file and find books 
	let file = fs.readFileSync("books.txt", 'utf8');
	let lines = file.split("\n");
	for(let i = 0; i < lines.length; i++) {
		let contents = lines[i].split("|");
		if(contents[2] == cat) {
			let book = {};
			book["title"] = contents[0];
			book["author"] = contents[1];
			book["year"] = parseInt(contents[3]);
			book["price"] = parseFloat(contents[4]);
			books.push(book);
		}
	}
	json["books"] = books;
	if(books.length == 0) {
		res.status(410);
	}

	return json;
}
