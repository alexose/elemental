// Set up websocket
var ws = new WebSocket('ws://{{server}}:{{port}}');

ws.onopen = function(){
    console.log('Connected to websocket.');
};

// Set up masonry
var container = document.querySelector('#container'),
    msnry     = new Masonry(container, { columnWidth: 1 });

var count,
    minWidth = Infinity;
ws.onmessage = function(evt){
  var obj;
  try {
    obj = JSON.parse(evt.data);
  } catch(e){
    console.log('Had trouble decoding string: ' + evt.data);
    return;
  }

  if (obj.total){
    count = obj.total;
    updateStatus(count);
  }

  if (obj.data && obj.tag){
    var img = $('<img />')
      .attr('title', obj.tag)
      .attr('src', 'data:image/png;base64,' + obj.data)
      .appendTo('#container');

    msnry.appended(img[0]);

    updateStatus(count--);
  }
};

function updateStatus(count){
  $('#status')
    .text('Streaming ' + count + ' results.');
}

// Set up input box behavior
$('form').submit(function(e){

  // Reset!
  $('#container img').remove();
  minWidth = Infinity;
  count    = undefined;

  e.preventDefault();

  var url = $(this).find('[name="url"]').val();

  ws.send(url);
  return false;
});

