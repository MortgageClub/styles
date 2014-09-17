// feature sniffing is good
// but can't help aganist bugs
// and differences in implementations
// between browsers and platforms
(function(W, D)
{
  var X
    , uaMatch       = ''
    , prefix        = ''
    , html          = D.documentElement
    , troubleMakers = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'
    ;

  // just check
  if (!html.className) html.className = '';

  // init checks, only browsers we care about
  X = {isWin: 0, isMac: 0, isX11: 0, isChrome: 0, isFirefox: 0, isMSIE: 0, isSafari: 0, isWebkit: 0};

  // platform
  if (navigator.userAgent.match(/Windows/))
  {
    X.isWin = true;
    html.className += ' x-win';
  }
  else if (navigator.userAgent.match(/Mac OS X/))
  {
    X.isMac = true;
    html.className += ' x-mac';
  }
  else if (navigator.userAgent.match(/X11/))
  {
    X.isX11 = true;
    html.className += ' x-x11';
  }

  // browser
  if (navigator.userAgent.match(/Chrome/))
  {
    X.isChrome = true;
    X.isWebkit = true;
    uaMatch = ' Chrome/';
    prefix = 'x-chrome';
  }
  else if (navigator.userAgent.match(/Safari/))
  {
    X.isSafari = true;
    X.isWebkit = true;
    uaMatch = ' Version/';
    prefix = 'x-safari';
  }
  else if (navigator.userAgent.match(/Firefox/))
  {
    X.isFirefox = true;
    uaMatch = ' Firefox/';
    prefix = 'x-firefox';
  }
  else if (navigator.userAgent.match(/MSIE/))
  {
    X.isMSIE = true;
    uaMatch = ' MSIE ';
    prefix = 'x-msie';
  }
  // add result preifx as browser class
  if (prefix)
  {
    html.className += ' '+prefix;
    if (X.isWebkit) html.className += ' x-webkit';

    // get major and minor versions
    // reduce, reuse, recycle
    uaMatch = navigator.userAgent.match(new RegExp(uaMatch+'(\\d+)\.(\\d+)'));

    if (uaMatch && uaMatch[1])
    {
      // set major and minor version
      X.version = uaMatch[1];
      X.minor = uaMatch[2];
      html.className += ' '+prefix+'-'+X.version + ' '+prefix+'-'+X.version+'-'+X.minor;
    }

    // add css shortcuts
    // it can fall for rare cases, e.g. Chrome 5, but it's a minority
    if ( (X.isWebkit && X.version > 4) || (X.isFirefox && X.version > 3) || (X.isMSIE && X.version > 8) )
    {
      html.className += ' x-modern';
    }
  }

  // {{{ simple html5 shim
  if (X.isMSIE && X.version < 9)
  {
    troubleMakers.replace(/\w+/g, function(el)
    {
      // create elements
      D.createElement(el);
    });
  }
  // }}}

  // put it to the flow
  W.x = X;

})(window, document);
