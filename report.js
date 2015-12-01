/**
 * Generate list of CSS properties, their format and CSS version.
 *
 * Navigate to http://www.w3schools.com/cssref/, paste into browser's console and run.
 * You will get Markdown code in console.
 *
 * Author: Vitaly Burlai
 **/
(function(window, $, console){
  var URL = 'http://www.w3schools.com/cssref/',
      rx = /<h2>CSS Syntax<\/h2>\r\n<div.*?><div>\r\n[^:]+:(.*)<\/div><\/div>/,
      NOT_DEPRECATED = { 'display': 1, '@font-face': 1 };
      res = {},
      pending = 0;

  function run() {
    var els = $('.w3-table-all tr td:first-child a');

    res[0] = '| Property | CSS |';
    res[1] = '|----------|-----|';

    for(var i = 1, l = els.length; i < l; i++) {
      pending++;
      $.get(els[i].href, parse.bind(null, els[i]));
    }
  }

  function parse(el, data) {
    var m,
        cssver = el.parentNode.parentNode.children[2].innerText,
        prop = el.innerText,
        href = el.href;

    if (prop.indexOf('-right') === -1 &&
        prop.indexOf('-top') === -1 &&
        prop.indexOf('-bottom') === -1) {
          if (NOT_DEPRECATED[prop] || data.indexOf('class="deprecated"') === -1){
            m = data.match(rx);
            if (m) {
              res[prop] = '| ['+prop.replace('-left', '-left/right/top/bottom')+']('+href+'):'+m[1].replace(/\|/g, '\\|')+' | '+cssver+'|';
            }
          } else {
            console.log(href + ' is deprecated (has quite limited support)');
          }
        }

    if (--pending == 0) {
      output();
    }
  }

  function output() {
    var md = '';
    for (var i in res) {
      if (res.hasOwnProperty(i)) {
        md += res[i] + '\n';
      }
    }
    console.log(md);
  }


  if (window.location.toString() !== URL) {
    window.location = URL;
    console.log('Page will reload, please run script again.');
  } else {
    run();
  }
})(window, $, console);
