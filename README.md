mobile-monkey
=============

### Touch event support for regular ol' jQuery

mobile-monkey simulates mouse events on touchscreens in the same way jQuery UI Touch Punch does,
only mobile-monkey patches jQuery's `.on` handler to provide a general patch for your entire application.


Why would I use this?
---------------------

You may notice a delay on your site when you use a touchscreen. This is because nearly all touchscreen 
devices have a [300ms delay][1] between firing the `touchstart` event and firing the `click` event.

Use this patch to invoke your handler earlier, providing a great experience on touch devices.

mobile-monkey even provides the necessary touch capabilities for jQuery UI!
 

Caveats
-------

* mobile-monkey currently only supports `click` events in non-delegation handlers. 

* mobile-monkey will not patch handlers bound to `document`. Binding mobile-monkey to `document` prevents
  the user from scrolling with their touchscreen.

* This is a monkey patch; a hack. Soon, Pointer events will be regularly consumable without 
  [awkward polyfills][2] that require you to rewrite large portions of your site, and we 
  can stop with this nonsense. 

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
 
 
[1]: http://blogs.telerik.com/appbuilder/posts/13-11-21/what-exactly-is.....-the-300ms-click-delay "What is the 300ms delay?"
[2]: http://www.polymer-project.org/platform/pointer-events.html#touch-action
