var mongodb = require('mongodb'),
    Spooky = require('spooky');

var args = process.argv || [];

if (args.length < 3 || args.length > 4){
   console.log('Usage: ' + args[0] + ' <url>');
   process.exit();
}

var url = args[2];

// Attempt to connect to Mongo
mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/elemental', function(err, db){
    if (err) {
        e = new Error('Failed to initialize Mongo');
        e.details = err;
        throw e;
    } else {
        init(db);
    }
});

function init(db){

    // Fire up Spooky
    var spooky = new Spooky({
            child: {
                transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                verbose: true,
                options: {
                    clientScripts: ['jquery.min.js']
                }
            }
        }, function(err){
            if (err) {
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            spooky.start(url);

            spooky.then(function(){
                this.emit('size', this.evaluate(function(){
                    var elements = $('div');
                    return elements.size();
                }));
            });

            spooky.run();
        });

    spooky.on('error', function(e, stack){
        console.error(e);

        if (stack) {
            console.log(stack);
        }
    });

    spooky.on('size', function (size) {
        console.log(size);
        process.exit();
    });
}
