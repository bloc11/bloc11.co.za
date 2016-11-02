var didScroll = false;

window.onscroll = function scroll(e) {
  didScroll = true;
}

function throttle() {
  if(didScroll) {
    didScroll = false;
    if (window.pageYOffset > 50) {
      document.getElementById('header').classList.add('floating')
    } else {
      document.getElementById('header').classList.remove('floating')
    }
  }
}

setInterval(throttle, 100);

if (window.pageYOffset > 50) {
  document.getElementById('header').classList.add('floating')
}

google.maps.event.addDomListener(window, 'load', init);

function scrollIt(element) {
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
      callback();
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}

var btns = document.querySelectorAll('.js-btn');
var sections = document.querySelectorAll('.js-section');
var done = function done() {
  console.log('done');
};

btns[0].addEventListener('click', function (e) {
  e.preventDefault();
  scrollIt(sections[0], 300, 'easeInQuad', done);
});

btns[1].addEventListener('click', function (e) {
  e.preventDefault();
  scrollIt(sections[1], 300, 'easeInQuad', done);
});

btns[2].addEventListener('click', function (e) {
  e.preventDefault();
  scrollIt(sections[2], 300, 'easeInQuad', done);
});

btns[3].addEventListener('click', function (e) {
  e.preventDefault();
  scrollIt(sections[3], 300, 'easeInQuad', done);
});

function init() {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(-33.911329, 18.471945),
    //icon: "http://localhost:8080/images/marker.png",
    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
  };
  var mapElement = document.getElementById('map');
  var map = new google.maps.Map(mapElement, mapOptions);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(-33.911329, 18.471945),
    map: map,
    title: 'Bloc 11'
  });
}
