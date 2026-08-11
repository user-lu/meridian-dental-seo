<div align="center">

# 🦷 Meridian Dental — Local SEO & Analytics Case Study

> A modern, high-performance static web application built with vanilla frontend technologies, featuring custom GA4 conversion pipelines, structured JSON-LD schema markup, and optimized OpenGraph infrastructure.

[![Live Site](https://img.shields.io/badge/Live_Demo-meridiandentalmesquite.com-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://meridiandentalmesquite.com)
[![Build Status](https://img.shields.io/badge/Netlify-Active-00C7B7?style=for-the-badge&logo=netlify)](https://app.netlify.com)
[![GA4 Verified](https://img.shields.io/badge/GA4-Custom_Events_Active-E37400?style=for-the-badge&logo=googleanalytics&logoColor=white)](#-custom-ga4-measurement-pipeline)
[![Schema Validated](https://img.shields.io/badge/Schema.org-100%25_Pass-34A853?style=for-the-badge&logo=google&logoColor=white)](#-local-seo--structured-data)

</div>

---

## 📌 Executive Summary

Local service businesses frequently suffer from slow, template-heavy CMS platforms that fail to capture user engagement accurately and lack technical local search visibility.

**Meridian Dental** was built to solve these exact challenges:

- **Conversion-First Architecture:** Eliminates render-blocking assets and relies on explicit client-side JavaScript for tracking instead of fragile default listeners.
- **Granular Behavioral Telemetry:** Records direct phone calls, validated appointment requests, FAQ engagement, and incremental scroll depth directly into GA4.
- **Enterprise Local SEO:** Features 100% validated JSON-LD `@type: "Dentist"` structured data and absolute OpenGraph preview infrastructure.

---

## 🛠️ Tech Stack & Tools

| Domain                       | Technologies / Tooling                                         |
| :--------------------------- | :------------------------------------------------------------- |
| **Frontend Core**            | Semantic HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+) |
| **Analytics & Telemetry**    | Google Analytics 4 (`gtag.js`), DataLayer Architecture         |
| **SEO & Structured Data**    | JSON-LD (`Schema.org`), Google Search Console, Screaming Frog  |
| **Hosting & Infrastructure** | Netlify Continuous Deployment (CI/CD), Custom DNS (Porkbun)    |

---

## 🏗️ Technical Architecture & Implementation

### 1. Custom GA4 Measurement Pipeline (`gtag.js`)

Instead of relying on GA4’s default auto-event listeners—which frequently record invalid or incomplete form clicks—explicit event listeners were engineered directly into `js/main.js`:

- **`generate_lead` (Primary Conversion):** Fires strictly after client-side form validation succeeds, passing an estimated lead value (`$250.00`) and location variables.
- **`generate_lead` (Phone Clicks):** Binds direct `click` handlers to `tel:` links to measure mobile tap-to-call conversions.
- **`select_content` (FAQ Interactions):** Captures accordion expansion events to identify high-interest patient queries (e.g., pricing, emergency services).
- **`scroll_depth` (Scroll Thresholds):** Measures incremental scroll engagement ($25\%$, $50\%$, $75\%$, $90\%$) using custom viewport scroll math.

<details>
<summary>🔍 <b>View Core JavaScript Event Dispatcher</b></summary>

```javascript
/**
 * Safely aggregates event variables to present down-funnel channel visibility inside GA4.
 */
function fireAppointmentConversionEvent() {
  // 1. Direct GA4 Event Dispatch
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "engagement",
      form_location: "homepage_hero",
      lead_type: "appointment_request",
      value: 250.0,
      currency: "USD",
    });
    console.log("GA4 Event Dispatched: generate_lead");
  }

  // 2. DataLayer Fallback Push (for GTM compatibility)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_lead_submitted",
    formLocation: "homepage_hero",
    leadType: "appointment_request",
    estimatedLeadValue: 250.0,
  });
}
```
