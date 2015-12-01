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
      rx = /<h2>CSS Syntax<\/h2>\r\n<div.*?><div>\r\n[^:]+: (.*)<\/div><\/div>/,
      NOT_DEPRECATED = { 'display': 1, '@font-face': 1 };
      FORMATS = {
        'background-position':
            'left/right/center top/botom/center|xpos ypos|initial|inherit;',

        'display':
            'inline|block|flex|inline-block/flex/table|list-item|run-in| table'+
            '|table-caption/cell/column/row|table-header/footer/row/column-group|none|initial|inherit;',

        'list-style-type':
            'disc|armenian|circle|cjk-ideographic|decimal|deciman-leading-zero'+
            '|georgian|hebrew|hiragana|katakana|hiragana/katakana-iroha'+
            '|lower-greek|lower/upper-alpha/latin/roman|none|square|initial|inherit;',

        'cursor':
            'alias|all-scroll|auto|cell|context-menu|col-resize|copy|crosshair|default'+
            '|e/ew/n/ne/nesw/ns/nw/nwse/row/s/se/sw/w-resize|grab|grabbing|help|move|no-drop'+
            '|none|not-allowed|pointer|progress|text|<i>URL</i>|vertical-text|wait|zoom-in/out|initial|inherit;'
      },
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
        propText = prop.replace('-left', '-left/right/top/bottom'),
        href = el.href,
        format;

    if (prop.indexOf('-right') === -1 &&
        prop.indexOf('-top') === -1 &&
        prop.indexOf('-bottom') === -1) {
          if (NOT_DEPRECATED[prop] || data.indexOf('class="deprecated"') === -1){
            m = data.match(rx);
            if (m) {
              format = (FORMATS[prop] || m[1]).replace(/\|/g, ' \\| ');
              res[prop] = '| ['+propText+']('+href+'): '+format+' | '+cssver+'|';
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
