// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/main.js":[function(require,module,exports) {
// Import'ları kaldırıyoruz
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import confetti from 'canvas-confetti';

// gsap.registerPlugin(ScrollTrigger);

// AOS başlatma
AOS.init({
  duration: 1000,
  once: true
});

// Kalp animasyonları
var createHearts = function createHearts() {
  var container = document.querySelector('.hearts-container');
  var heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
  setInterval(function () {
    var heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    container.appendChild(heart);
    setTimeout(function () {
      heart.remove();
    }, 15000);
  }, 300);
};

// Hero Animasyonları
var heroAnimation = function heroAnimation() {
  var tl = gsap.timeline();
  tl.to('.hero__title', {
    opacity: 1,
    y: 0,
    duration: 1
  }).to('.hero__subtitle', {
    opacity: 1,
    y: 0,
    duration: 1
  }, '-=0.5').to('#startButton', {
    opacity: 1,
    y: 0,
    duration: 1
  }, '-=0.5');
};

// Scroll Animasyonları
var initScrollAnimations = function initScrollAnimations() {
  gsap.utils.toArray('.story__section').forEach(function (section) {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    });
  });
};

// Adım gösterme fonksiyonu
var showStep = function showStep(stepId) {
  // Tüm adımları gizle
  document.querySelectorAll('.story__step').forEach(function (step) {
    step.classList.remove('active');
  });

  // İstenen adımı göster
  var currentStep = document.getElementById(stepId);
  if (currentStep) {
    currentStep.classList.add('active');
  }
};

// Başlangıç butonu için event listener
var initStartButton = function initStartButton() {
  var startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', function () {
      // İlk adımı göster
      showStep('step1');

      // Story bölümüne smooth scroll
      document.querySelector('.story').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Konfeti efekti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    });
  }
};

// İleri butonları için event listener
var initNextButtons = function initNextButtons() {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn--next')) {
      var nextStepId = e.target.dataset.next;
      showStep(nextStepId);
    }
  });
};

// Kaçan hayır butonu
var initNoButton = function initNoButton() {
  var noButton = document.getElementById('noButton');
  var clickCount = 0;
  if (noButton) {
    var moveButton = function moveButton() {
      clickCount++;
      // Butonun ekrandan çıkmaması için sınırları belirle
      var maxX = window.innerWidth - noButton.offsetWidth - 20; // 20px margin
      var maxY = window.innerHeight - noButton.offsetHeight - 20;

      // Random pozisyon hesapla ama ekran sınırları içinde
      var x = Math.min(Math.max(20, Math.random() * maxX), maxX);
      var y = Math.min(Math.max(20, Math.random() * maxY), maxY);
      noButton.style.position = 'fixed';
      noButton.style.left = "".concat(x, "px");
      noButton.style.top = "".concat(y, "px");

      // İkinci tıklamada özel mesaj
      if (clickCount >= 2) {
        var message = document.createElement('div');
        message.className = 'forgive-message';
        message.innerHTML = "\n                    <div class=\"forgive-message__title\">\uD83E\uDD7A A\u015Fk\u0131m Ne Yapmaya \xC7al\u0131\u015F\u0131yorsun?</div>\n                    <div class=\"forgive-message__text\">L\xFCtfen 'Hay\u0131r' Deme, Beni \xC7ok \xDCz\xFCyorsun...</div>\n                ";
        document.body.appendChild(message);

        // Kalp efekti ekle
        createHeartRain();

        // Mesajı 3 saniye sonra kaldır
        setTimeout(function () {
          return message.remove();
        }, 3000);

        // Hayır butonunu daha hızlı hareket ettir
        noButton.style.transition = 'all 0.2s ease';
      }
    };
    noButton.addEventListener('mouseover', moveButton);
    noButton.addEventListener('click', moveButton);
  }
};

// Evet butonu için event listener
var initYesButton = function initYesButton() {
  var yesButton = document.getElementById('yesButton');
  if (yesButton) {
    yesButton.addEventListener('click', function () {
      showStep('final');
      createHeartRain();

      // Büyük konfeti patlaması
      var duration = 15 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        shapes: ['star', 'circle']
      };
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
          particleCount: particleCount,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
        }));
        confetti(Object.assign({}, defaults, {
          particleCount: particleCount,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
        }));
      }, 250);

      // Mesaj göster
      var message = document.createElement('div');
      message.className = 'forgive-message';
      message.innerHTML = "\n                <div class=\"forgive-message__title\">\uD83D\uDC9D Te\u015Fekk\xFCr Ederim Can\u0131m \uD83D\uDC9D</div>\n                <div class=\"forgive-message__text\">Seni \xC7ok Seviyorum</div>\n            ";
      document.body.appendChild(message);
      setTimeout(function () {
        message.remove();
      }, 5000);
    });
  }
};

// Kalp yağmuru efekti
var createHeartRain = function createHeartRain() {
  var container = document.createElement('div');
  container.className = 'heart-rain';
  document.body.appendChild(container);
  var heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
  var numberOfHearts = 50;
  for (var i = 0; i < numberOfHearts; i++) {
    setTimeout(function () {
      var heart = document.createElement('div');
      heart.className = 'rain-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.fontSize = Math.random() * 20 + 20 + 'px';
      container.appendChild(heart);
      heart.addEventListener('animationend', function () {
        heart.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      });
    }, i * 100);
  }
};

// Yüzen kalpler animasyonu
var createFloatingHearts = function createFloatingHearts() {
  var container = document.querySelector('.floating-hearts');
  if (container) {
    var heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
    var createHeart = function createHeart() {
      var heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      container.appendChild(heart);
      heart.addEventListener('animationend', function () {
        heart.remove();
      });
    };
    setInterval(createHeart, 300);
  }
};

// Müzik kontrolü
var initMusicPlayer = function initMusicPlayer() {
  var music = document.getElementById('bgMusic');
  var musicToggle = document.getElementById('musicToggle');
  var progressBar = document.querySelector('.progress');

  // Sayfa yüklendiğinde direkt başlat
  var playMusic = function playMusic() {
    if (music.paused) {
      music.play();
      musicToggle.classList.add('playing');
    }
  };

  // Sayfa yüklendiğinde çalmayı dene
  playMusic();

  // Kullanıcı etkileşimi olduğunda tekrar dene (bazı tarayıcılar için)
  document.addEventListener('click', playMusic, {
    once: true
  });

  // Progress bar güncelleme
  music.addEventListener('timeupdate', function () {
    var progress = music.currentTime / music.duration * 100;
    progressBar.style.width = progress + '%';
  });
  musicToggle.addEventListener('click', function () {
    if (music.paused) {
      music.play();
      musicToggle.classList.add('playing');
    } else {
      music.pause();
      musicToggle.classList.remove('playing');
    }
  });
};

// Balon animasyonu
var createBalloons = function createBalloons() {
  var container = document.querySelector('.floating-balloons');
  var balloonEmojis = ['🎈', '🎊', '🎉'];
  setInterval(function () {
    var balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    container.appendChild(balloon);
    balloon.addEventListener('animationend', function () {
      return balloon.remove();
    });
  }, 2000);
};

// Pasta mumları üfleme
var initCakeInteraction = function initCakeInteraction() {
  var blowButton = document.getElementById('blowCandles');
  if (blowButton) {
    blowButton.addEventListener('click', function () {
      // Konfeti patlaması
      confetti({
        particleCount: 150,
        spread: 180,
        origin: {
          y: 0.8
        }
      });

      // Dilek tutma mesajı
      var message = document.createElement('div');
      message.className = 'forgive-message';
      message.innerHTML = "\n                <div class=\"forgive-message__title\">\u2728 Dile\u011Fin Kabul Olsun \u2728</div>\n                <div class=\"forgive-message__text\">Ben senin i\xE7in hep mutluluk diliyorum</div>\n            ";
      document.body.appendChild(message);
      setTimeout(function () {
        return message.remove();
      }, 3000);
    });
  }
};

// Anıları sırayla gösterme
var initMemories = function initMemories() {
  var memories = document.querySelectorAll('.memory-text');
  var currentIndex = 0;
  var showNextMemory = function showNextMemory() {
    memories.forEach(function (memory) {
      return memory.classList.remove('active');
    });
    memories[currentIndex].classList.add('active');
    currentIndex = (currentIndex + 1) % memories.length;
  };
  setInterval(showNextMemory, 3000);
};

// Son dilek butonu için event listener
var initFinalWish = function initFinalWish() {
  var finalWishButton = document.getElementById('finalWishButton');
  if (finalWishButton) {
    finalWishButton.addEventListener('click', function () {
      // Büyük konfeti patlaması
      var duration = 20 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = {
        startVelocity: 45,
        spread: 360,
        ticks: 100,
        zIndex: 0,
        shapes: ['star', 'heart']
      };
      var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 75 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
          particleCount: particleCount,
          origin: {
            x: randomInRange(0.2, 0.8),
            y: Math.random() - 0.2
          },
          colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
        }));
      }, 200);

      // Özel mesaj göster
      var message = document.createElement('div');
      message.className = 'forgive-message';
      message.innerHTML = "\n                <div class=\"forgive-message__title\">\uD83D\uDC9D Benimle Evlenir misin? \uD83D\uDC9D</div>\n                <div class=\"forgive-message__text\">Hayat\u0131m\u0131n Sonuna Kadar Seninle Olmak \u0130stiyorum</div>\n            ";
      document.body.appendChild(message);
      setTimeout(function () {
        return message.remove();
      }, 8000);
    });
  }
};

// Final butonu için event listener
var initFinaleButton = function initFinaleButton() {
  var finaleButton = document.getElementById('finaleButton');
  if (finaleButton) {
    finaleButton.addEventListener('click', function () {
      // Büyük final efekti
      var duration = 30 * 1000; // 30 saniye
      var animationEnd = Date.now() + duration;
      var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        // Çoklu konfeti patlaması
        confetti({
          particleCount: 100,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4'],
          ticks: 200,
          shapes: ['star', 'heart']
        });
      }, 250);

      // Final mesajı
      var message = document.createElement('div');
      message.className = 'forgive-message';
      message.innerHTML = "\n                <div class=\"forgive-message__title\">\uD83D\uDC9D Seni Sonsuza Dek Sevece\u011Fim \uD83D\uDC9D</div>\n                <div class=\"forgive-message__text\">\u0130yi ki Do\u011Fdun, \u0130yi ki Vars\u0131n...</div>\n            ";
      document.body.appendChild(message);

      // Ekstra kalp yağmuru
      createHeartRain();
      setTimeout(function () {
        message.remove();
        // Son mesaj
        var finalMessage = document.createElement('div');
        finalMessage.className = 'forgive-message';
        finalMessage.innerHTML = "\n                    <div class=\"forgive-message__title\">\u2728 Mutlu Y\u0131llar \u2728</div>\n                    <div class=\"forgive-message__text\">Seninle Nice G\xFCzel Ya\u015Flara...</div>\n                ";
        document.body.appendChild(finalMessage);
        setTimeout(function () {
          return finalMessage.remove();
        }, 5000);
      }, 8000);
    });
  }
};

// Sürpriz efektleri
var initSurprises = function initSurprises() {
  var surpriseButton = document.getElementById('surpriseButton');
  var surpriseGallery = document.getElementById('surpriseGallery');
  var clickCount = 0;
  if (surpriseButton) {
    surpriseButton.addEventListener('click', function () {
      clickCount++;

      // Her tıklamada farklı sürprizler
      switch (clickCount) {
        case 1:
          // Kalp yağmuru
          createHeartRain();
          break;
        case 2:
          // Konfeti patlaması
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {
              y: 0.6
            }
          });
          break;
        case 3:
          // Sürpriz galeri
          surpriseGallery.classList.add('active');
          clickCount = 0;
          break;
      }

      // Uçan kalpler efekti
      var heart = document.createElement('div');
      heart.className = 'surprise-heart';
      heart.innerHTML = '❤️';
      heart.style.left = Math.random() * 100 + 'vw';
      document.body.appendChild(heart);
      setTimeout(function () {
        return heart.remove();
      }, 4000);
    });
  }
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function () {
  heroAnimation();
  initStartButton();
  initNextButtons();
  initNoButton();
  initYesButton();
  createFloatingHearts();
  initMusicPlayer();
  createBalloons();
  initCakeInteraction();
  initMemories();
  initFinalWish();
  initFinaleButton();
  initSurprises();
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50790" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map