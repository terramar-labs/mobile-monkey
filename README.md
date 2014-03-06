mobile-monkey
=============

### Touch event support for regular ol' jQuery

mobile-monkey simulates mouse events on touchscreens in the same way jQuery UI Touch Punch does,
only it patches jQuery's `.on` handler to provide a general patch for your entire application.


Why would I use this?
---------------------

You my notice a delay on your site when you use a touchscreen. This is because nearly all touchscreen 
devices have a 300ms delay between the `touchstart` event and the `click` event.

Use this patch to invoke your handler earlier, providing a great experience on touch devices.

mobile-monkey even provides the necessary touch capabilities for jQuery UI!
 

Caveats
-------

* mobile-monkey currently only supports `click` events in non-delegation handlers. 

* mobile-monkey will not patch handlers bound to `document`. Binding mobile-monkey to `document` prevents
  the user from scrolling with their touchscreen.


Usage
-----

1.  Grab `jquery.mobile-monkey.js` from the repository and add it to your project.

2.  Include jQuery and mobile-monkey on your page.
    ```html
    <script src="//code.jquery.com/jquery.min.js"></script>
    <script src="jquery.mobile-monkey.js"></script>
    ```

3.  And you're set! Your `click` handlers will now get fired much sooner, giving touchscreen users a much more
    pleasant experience on your website.


_Tested on iPad, iPhone, Android and other touch-enabled mobile devices._


Thanks, Dave
------------

Thanks to Dave Furfero for making a great and useful plugin!

_[Visit the official Touch Punch website](http://touchpunch.furf.com)._

mobile-monkey is a derivative work of jQuery UI Touch Punch and is dual licensed under
the MIT and GPLv2 licenses.

Original copyright: Copyright 2011–2014, Dave Furfero 