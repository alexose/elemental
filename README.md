Elemental
=========

Quickly audit every element on a page.

Elemental first renders a page, then proceeds to split it into roughly equal-sized elements.  A screenshot of each element, its underlying HTML, and computed styles are then recorded into a database.  Finally, these images are loaded and arranged by visual similarity.

INSTALLATION

You'll need to install casperjs globally with npm:

    npm install -g casperjs

And then install:

    git clone git@github.com:alexose/elemental.git
    cd elemental
    npm install
