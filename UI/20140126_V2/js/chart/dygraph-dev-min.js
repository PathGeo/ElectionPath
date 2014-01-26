/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */

// A dygraph "auto-loader".

// Check where this script was sourced from. If it was sourced from
// '../dygraph-dev.js', then we should source all the other scripts with the
// same relative path ('../dygraph.js', '../dygraph-canvas.js', ...)
(function() {
  var src=document.getElementsByTagName('script');
  var script = src[src.length-1].getAttribute("src");
  
  // This list needs to be kept in sync w/ the one in generate-combined.sh
  // and the one in jsTestDriver.conf.
  var source_files = [
    //"stacktrace.js",
    //"dashed-canvas.js",
    "dygraph-combined.js",
    "plugins/range-selector2.js",
    "dygraph-interaction-model.js"
  ];

  for (var i = 0; i < source_files.length; i++) {
    document.write('<script type="text/javascript" src="' + script.replace('dygraph-dev.js', source_files[i]) + '"></script>\n');
  }
  
})();
