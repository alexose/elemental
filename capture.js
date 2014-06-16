var system = require('system')

if (system.args.length < 2 || system.args.length > 3){
    console.log('Usage: ' + system.args[0] + ' <url>');
    phantom.exit();
}

var page = require('webpage').create(),
    url  = system.args[1];

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access the network!');
    } else {

        var coords = page.evaluate(find);

        system.stdout.write(coords.length + '\n');

        for (var i in coords){
          page.clipRect = coords[i];
          var base64 = page.renderBase64('PNG');
          system.stdout.write(base64 + '\n');
        }
    }
    phantom.exit();
});


function find(){
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
