sections.js
===========

## Quick start

    var page = sections.create({
      // config  
    });

    window.onload = function () {
      page.start();

      page.on('changed', function () {
        // ...
      });
    };

## Sections API

All sections are instances of EventEmitter.

### Events

* `progress`
    * percent (range: 0 ~ 100)
* `changed`
    * current section
    * previous section

### .start(config)

Use this method after entire page has loaded.

#### Default config

* `className`: section
* `interval`: 200
    progress update frequency
* `autoSectionHeight`: true
    Set section height equal to screen size automatically

### .get(index)

Get section by index.

### .section(index, fn)

Get a section and wrap it into the function.

## Section API

All section are instance of EventEmitter.

### Events

* `progress`
    * percent (range: -100 ~ 100)
* `scrollIn`
    * way (-1: top to bottom, 1: bottom to top)
* `scrollOut`
    * way (-1: bottom to top, 1: top to bottom)

## License

(The MIT License)

Copyright (c) 2013 Po-Ying Chen &lt;poying.me@gmail.com&gt;.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
