Elemental
=========

Quickly audit every element on a page.

Elemental renders every element on a page to a PNG base64 string, streams the results back via websocket, and sorts by visual similarity.

Try a live demo at http://elemental.alexose.com

## Installation

You'll need to install phantomjs (>1.9.0) globally with npm:

    npm install -g phantomjs

And then install:

    git clone git@github.com:alexose/elemental.git
    cd elemental
    npm install
