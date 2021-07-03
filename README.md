# opmlPackage

Node and browser code that reads and writes OPML.

### The node package

It's on NPM, it's called OPML.

Here's a snippet that reads an OPML file, converts it to a JavaScript object, displays it to the console via JSON.stringify.

```javascriptfs.readFile ("states.opml", function (err, opmltext) {	opml.parse (opmltext, function (err, theOutline) {		console.log (JSON.stringify (theOutline));		});	});```

