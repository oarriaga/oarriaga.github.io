(function () {
  const consentKey = "site-analytics-consent";
  const measurementId = "G-3NNM7GXY1S";
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  const bannerId = "analytics-consent";
  let analyticsLoaded = false;

  function readConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      return;
    }
  }

  function isLocalPreview() {
    return (
      window.location.protocol === "file:" ||
      localHosts.has(window.location.hostname)
    );
  }

  function removeBanner() {
    const banner = document.getElementById(bannerId);
    if (banner) {
      banner.remove();
    }
    document.body.classList.remove("analytics-consent-open");
  }

  function loadAnalytics() {
    if (analyticsLoaded) {
      return;
    }

    if (document.querySelector("[data-google-analytics-id]")) {
      analyticsLoaded = true;
      return;
    }

    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(measurementId);
    script.dataset.googleAnalyticsId = measurementId;
    document.head.appendChild(script);
  }

  function buildPrivacyUrl() {
    return new URL("/privacy.html", window.location.origin).href;
  }

  function createActionLink(text, href) {
    const link = document.createElement("a");
    link.className = "analytics-consent-link";
    link.href = href;
    link.textContent = text;
    return link;
  }

  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "analytics-consent-button";
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  function createTextButton(text, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "analytics-consent-link-button";
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  function showBanner() {
    if (!document.body || document.getElementById(bannerId)) {
      return;
    }

    const banner = document.createElement("aside");
    banner.id = bannerId;
    banner.className = "analytics-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics preferences");

    const copy = document.createElement("p");
    copy.className = "analytics-consent-copy";
    copy.textContent =
      "This site uses optional analytics to understand visits.";

    const actions = document.createElement("div");
    actions.className = "analytics-consent-actions";

    actions.appendChild(createButton("Accept", () => {
      writeConsent("accepted");
      removeBanner();
      loadAnalytics();
    }));

    actions.appendChild(createTextButton("No thanks", () => {
      writeConsent("declined");
      removeBanner();
    }));

    actions.appendChild(createActionLink("Privacy", buildPrivacyUrl()));

    banner.appendChild(copy);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    document.body.classList.add("analytics-consent-open");
  }

  function init() {
    if (isLocalPreview()) {
      return;
    }

    const consent = readConsent();
    if (consent === "accepted") {
      loadAnalytics();
      return;
    }

    if (consent === "declined") {
      return;
    }

    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
