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
                this.emit('size', this.evaluate(subdivide));

                // Breaks a document down into pieces and returns a list of selectors
                function subdivide(){
                    var elements = $('div');

                    elements.each(function(d, i){
                        var str = 'data-temporary-index';
                        $(this).attr(str, i);
                    });

                    return elements.size();
                }

                return;
            });

            spooky.run();
        });

    spooky.on('console', function (line) {
        console.log(line);
    });

    spooky.on('error', function(e, stack){
        console.error(e);

        if (stack) {
            console.log(stack);
        }
    });

    spooky.on('size', function(size){

        // Record screenshots of each element
        for (var i=1; i<50; i++){
            console.log('capturing element ' + i);

            // Strange example of function tuple via:
            // https://github.com/WaterfallEngineering/SpookyJS/issues/22
            this.then([{ i : i }, function(){
                //this.capture('lol.png');
                //this.captureSelector('element-' + i + '.png', '[data-temporary-index=' + i + ']');
                this.captureSelector('output/element-' + i + '.png', 'div:nth-of-type(' + i + ')');
            }]);
            console.log(size);
        }

    });
}

var minimum = {
    width:  20,
    height: 20
}

