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
        system.stdout.write(JSON.stringify({
          total : coords.length
        }) + '\n');

        coords.forEach(function(d,i){

          console.log(d.rect.width);

          var base64 = page.renderBase64('PNG');
          page.clipRect = d.rect;
          system.stdout.write(JSON.stringify({
            tag  : d.tag,
            data : base64
          }) + '\n');
        });
    }
    phantom.exit();
});

function find(){
    var all    = document.getElementsByTagName("*"),
        coords = [];

    for (var i=0, max=all.length; i < max; i++) {
        var ele = all[i],
            rect = ele.getBoundingClientRect(),
            tag = ele.tagName;

        if (rect.height && rect.width){
            coords.push({
              tag  : tag,
              rect : rect
            });
        }
    }

    // Sort by width
    coords.sort(sortFunc);

    return coords;

    function sortFunc(a,b){
        var w1 = a.rect.width,
            w2 = b.rect.width;

        if (w1 > w2){
            return 1;
        }
        if (w1 < w2){
            return -1;
        }
        return 0;
    }
}

