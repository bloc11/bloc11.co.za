'use strict';

// Modals
(function () {

  // add event to each openModal button
  var openModalBtns = document.getElementsByClassName('js-modal-open-btn');
  for (var i = 0; i < openModalBtns.length; ++i) {
    openModalBtns[i].addEventListener('click', function (e) {
      // find the modal the button is pointing to and stop hiding the modal
      var targetId = e.target.getAttribute('target-modal-id');
      var target = document.getElementById(targetId);
      target.classList.remove('closed');
    });
  }

  // add events to each modal 
  var modals = document.getElementsByClassName('modal');
  for (var i = 0; i < modals.length; ++i) {
    modals[i].addEventListener('click', function (e) {
      e.target.classList.add('closed');
    })
  }

  // add even to close buttons
  var modalCloseBtns = document.getElementsByClassName('js-close-btn');
  for (var i = 0; i < modalCloseBtns.length; ++i) {
    modalCloseBtns[i].addEventListener('click', function (e) {
      // will close all modals
      var modals = document.getElementsByClassName('modal');
      for (var i = 0; i < modals.length; ++i) {
        modals[i].classList.add('closed');
      }
    })
  }
})();

// Nav menu background
(function () {
  var didScroll = false;

  window.onscroll = function scroll(e) {
    didScroll = true;
  }

  function updateHeaderBG() {
    if (didScroll) {
      didScroll = false;
      if (window.pageYOffset > 50) {
        document.getElementById('header').classList.add('floating')
      } else {
        document.getElementById('header').classList.remove('floating')
      }
    }
  }

  setInterval(updateHeaderBG, 100);
})();

// Smooth navigation button scrolling
(function () {

  // Add onClick events to buttons that scroll smoothly to their href targets
  var nav_btns = document.querySelectorAll('.js-btn');

  Array.prototype.forEach.call(nav_btns, function (node) {
    var target_id = node.getAttribute('href').replace('#', '');
    var target = document.getElementById(target_id);
    if (target) {
      node.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToElementSmoothly(target, 300, 'easeInQuad');
      });
    }
  });

  function scrollToElementSmoothly(element) {
    var duration = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];
    var easing = arguments.length <= 2 || arguments[2] === undefined ? 'linear' : arguments[2];
    var callback = arguments[3];

    // timing functions
    var easings = {
      linear: function linear(t) {
        return t;
      },
      easeInQuad: function easeInQuad(t) {
        return t * t;
      },
      easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
      },
      easeInOutQuad: function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic: function easeInCubic(t) {
        return t * t * t;
      },
      easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
      },
      easeInOutCubic: function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
      },
      easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
      },
      easeInOutQuart: function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
      },
      easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
      },
      easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
      },
      easeInOutQuint: function easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
      }
    };

    function checkBody() {
      document.documentElement.scrollTop += 1;
      var body = document.documentElement.scrollTop !== 0 ? document.documentElement : document.body;
      document.documentElement.scrollTop -= 1;
      return body;
    }

    var body = checkBody();
    var start = body.scrollTop;
    var startTime = Date.now();

    var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var destination = documentHeight - element.offsetTop < windowHeight ? documentHeight - windowHeight : element.offsetTop - 50;

    function scroll() {
      var now = Date.now();
      var time = Math.min(1, (now - startTime) / duration);
      var timeFunction = easings[easing](time);
      body.scrollTop = timeFunction * (destination - start) + start;

      if (body.scrollTop === destination) {
        if (callback)
          callback();
        return;
      }
      requestAnimationFrame(scroll);
    }
    scroll();
  }

})();

// Google maps
(function () {
  // Must have google api script imported above
  google.maps.event.addDomListener(window, 'load', init);
  function init() {
    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(-33.911329, 18.471945),
      styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
    };
    var mapElement = document.getElementById('map');
    var map = new google.maps.Map(mapElement, mapOptions);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(-33.910382, 18.472563),
      map: map,
      title: 'Bloc 11'
    });
  }

  document.getElementById('map-overlay').addEventListener('click', function (e) {
    e.target.classList.add('hide');
  });
})();
