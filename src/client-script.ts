export const CLIENT_SCRIPT = String.raw`(function () {
  var currentScript = document.currentScript;
  var apiBase = currentScript && currentScript.src ? new URL(currentScript.src).origin : window.location.origin;
  var loadedScripts = {};
  var widgets = {};

  function loadScript(src) {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Failed to load captcha provider script.')); };
      document.head.appendChild(script);
    });
    return loadedScripts[src];
  }

  function encodeToken(payload) {
    var json = JSON.stringify(payload);
    var binary = unescape(encodeURIComponent(json));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function getElement(container) {
    if (typeof container === 'string') return document.querySelector(container);
    return container;
  }

  async function createChallenge(options) {
    var response = await fetch(apiBase + '/v1/challenges', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        site_key: options.siteKey,
        action: options.action || null,
        hostname: window.location.hostname
      })
    });
    var data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error_code || 'Captcha challenge failed.');
    }
    return data;
  }

  async function renderTurnstile(element, options, config) {
    await loadScript(config.script_url + '?render=explicit');
    if (!window.turnstile) throw new Error('Turnstile is not available.');

    var widgetId = window.turnstile.render(element, {
      sitekey: config.public_key,
      action: options.action,
      theme: options.theme || config.options.theme || 'auto',
      size: options.size || config.options.size || 'normal',
      callback: function (providerToken) {
        var captchaToken = encodeToken({ challenge_id: config.challenge_id, provider_token: providerToken });
        if (options.callback) options.callback(captchaToken);
      },
      'error-callback': function () {
        if (options.errorCallback) options.errorCallback(new Error('Turnstile challenge failed.'));
      }
    });

    widgets[widgetId] = { provider: 'turnstile', widgetId: widgetId };
    return widgetId;
  }

  async function renderGeetest(element, options, config) {
    await loadScript(config.script_url);
    if (!window.initGeetest4) throw new Error('Geetest is not available.');

    return new Promise(function (resolve, reject) {
      window.initGeetest4({
        captchaId: config.public_key,
        product: config.options.product || 'float'
      }, function (captchaObj) {
        captchaObj.appendTo(element);
        captchaObj.onSuccess(function () {
          var result = captchaObj.getValidate();
          var captchaToken = encodeToken({ challenge_id: config.challenge_id, provider_token: result });
          if (options.callback) options.callback(captchaToken);
        });
        captchaObj.onError(function () {
          if (options.errorCallback) options.errorCallback(new Error('Geetest challenge failed.'));
        });
        var widgetId = 'geetest_' + config.challenge_id;
        widgets[widgetId] = { provider: 'geetest', widget: captchaObj };
        resolve(widgetId);
      });
    }).catch(function (error) {
      if (options.errorCallback) options.errorCallback(error);
      throw error;
    });
  }

  window.TeavenCaptcha = {
    ready: function (callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
      } else {
        callback();
      }
    },
    render: async function (container, options) {
      var element = getElement(container);
      if (!element) throw new Error('Captcha container not found.');
      if (!options || !options.siteKey) throw new Error('siteKey is required.');

      var config = await createChallenge(options);
      if (config.provider === 'turnstile') return renderTurnstile(element, options, config);
      if (config.provider === 'geetest') return renderGeetest(element, options, config);
      throw new Error('Unsupported captcha provider: ' + config.provider);
    },
    reset: function (widgetId) {
      if (widgetId && widgets[widgetId] && widgets[widgetId].provider === 'geetest') {
        widgets[widgetId].widget.reset();
        return;
      }
      if (window.turnstile) window.turnstile.reset(widgetId);
    }
  };
})();`;
