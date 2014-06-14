var mongodb = require('mongodb')
  , Spooky = require('spooky');

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

  // Attempt to Fire up Spooky
  try {
    var spooky = new Spooky({
        child: {
          transport: 'http'
        },
        casper: {
          logLevel: 'debug',
          verbose: true
        }
      }, function(err){
        if (err) {
          display(err);
        }

        crawl(spooky);
      });
  } catch(e){
    console.log('hello');
    display(e);
  }

  function display(err){
    e = new Error('Failed to initialize SpookyJS');
    e.details = err;
    throw e;
  }

}

function crawl(spooky){

  spooky.start(url);

  spooky.then(function(){

      this.emit('coords', this.evaluate(subdivide));

      // Breaks a document down into pieces and returns a array of coordinates
      function subdivide(){

        var all    = document.getElementsByTagName("*"),
            coords = [];

        for (var i=0, max=all.length; i < max; i++) {
          var rect = all[i].getBoundingClientRect();

          if (rect.height && rect.width){
            coords.push(rect);
          }
        }
        return coords;
      }
    });

  spooky.on('coords', function(coords){

    var json = JSON.stringify(coords);

    spooky.then(function(){

    });

    spooky.then([{ coords : coords }, function(){

      for (var i in coords){
        spooky.capture('output/image-' + i + '.png', coords[i]);
      }
    }]);
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

  spooky.run();

}
