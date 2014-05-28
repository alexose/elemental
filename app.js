var mongodb = require('mongodb'),
    Spooky = require('spooky');

var args = process.argv || [];

if (args.length < 3){
   console.log('Usage: ' + args[0] + ' <url>');
   process.exit();
}

// Attempt to connect to Mongo
mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/elemental', function(err, db){
    if (err) {
        throw err;
    }
});

// Fire up Spooky
var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(
            'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
        spooky.then(function () {
            this.emit('hello', 'Hello, from ' + this.evaluate(function () {
                return document.title;
            }));
        });
        spooky.run();
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});
