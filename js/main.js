/**
 * Meridian Dental Arts - Core Frontend Sandbox Script
 * Manages appointment conversions and asynchronous GTM tracking pipelines.
 */

document.addEventListener("DOMContentLoaded", () => {
  initFormTracking();
  initFaqAccordion();
  initNavigationTransitions();
  initPhoneTracking();
  initScrollTracking();
});

/**
 * Handles smooth scrolling animations and collapses the mobile hamburger drawer.
 */
function initNavigationTransitions() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(
    "nav a, .service-link, .primary-btn",
  );
  const headerOffset = 80; // Matches the CSS scroll-padding-top layout spacing

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      // Only intercept local anchor links
      if (targetId && targetId.startsWith("#")) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculate precise element destination relative to the sticky header offset
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          // Execute custom animated scroll window shift
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        // Automatically collapse the mobile drawer if it's open
        if (menuToggle) {
          menuToggle.checked = false;
        }
      }
    });
  });
}

/**
 * Attaches submit interception loops to the appointment intake engine.
 */
function initFormTracking() {
  const appointmentForm = document.getElementById("quote-form");

  if (!appointmentForm) {
    console.warn(
      "SEO Audit Notice: #quote-form element missing from active viewport nodes.",
    );
    return;
  }

  appointmentForm.addEventListener("submit", function (event) {
    // Halt standard page postback refresh to protect active analytics stream state
    event.preventDefault();

    const nameField = document.getElementById("user-name");
    const emailField = document.getElementById("user-email");
    const phoneField = document.getElementById("user-phone");

    if (!nameField.value || !emailField.value || !phoneField.value) {
      alert("Please fill out all required fields.");
      return;
    }

    const baselinePayload = {
      patientName: nameField.value,
      patientEmail: emailField.value,
      patientPhone: phoneField.value,
    };

    console.log("Intake processing verified for submission:", baselinePayload);

    // Dispatches tracked event payload straight into the GTM engine wrapper
    fireAppointmentConversionEvent();

    // Perform visual mutation swap to confirmation view
    displayFormSuccess(appointmentForm);
  });
}

/**
 * Safely aggregates event variables to present down-funnel channel visibility inside GA4.
 */
function fireAppointmentConversionEvent() {
  // Send directly to GA4 via gtag (standard)
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "engagement",
      form_location: "homepage_hero_footer",
      lead_type: "appointment_request",
      value: 250.0,
      currency: "USD",
    });
    console.log("GA4 Event Dispatched: generate_lead");
  }

  // Pushes to DataLayer for GTM (backup)
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "form_lead_submitted",
    formLocation: "homepage_hero_footer",
    leadType: "appointment_request",
    estimatedLeadValue: 250.0, // Average diagnostic baseline value for patient lifecycle metrics
  });

  console.log(
    "DataLayer Event Successfully Dispatched: form_lead_submitted (Type: appointment_request)",
  );
}

/**
 * Transitions layout blocks natively on the screen upon successful interaction milestones.
 */
function displayFormSuccess(formElement) {
  const container = formElement.parentElement;
  formElement.style.display = "none";

  const alertBox = document.createElement("div");
  alertBox.className = "form-success-alert";
  alertBox.innerHTML = `
        <h3>Appointment Request Received</h3>
        <p>Thank you! Our dental scheduling team will contact you shortly to confirm your requested time block.</p>
    `;

  container.appendChild(alertBox);
}

/**
 * Enhances the native FAQ accordion layout behavior and tracks interaction signals.
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const summary = item.querySelector(".faq-question");

    if (!summary) return;

    summary.addEventListener("click", () => {
      // Trigger tracking only when opening an item (not when collapsing it)
      if (!item.hasAttribute("open")) {
        // Close all other open FAQ items for cleaner UI
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.removeAttribute("open");
          }
        });

        const questionText = summary.textContent.trim();

        // 1. Send directly to GA4 via gtag (Standard GA4 Event)
        if (typeof gtag === "function") {
          gtag("event", "select_content", {
            content_type: "faq_accordion",
            item_id: questionText,
          });
          console.log(`GA4 Event Dispatched: select_content (${questionText})`);
        }

        // 2. Also push to DataLayer (For GTM / backup)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "faq_question_opened",
          questionText: questionText,
        });

        console.log(`Tracked FAQ Engagement Event: ${questionText}`);
      }
    });
  });
}

/**
 * Tracks direct phone call clicks as high-value lead conversions.
 */
function initPhoneTracking() {
  const phoneLink = document.getElementById("phone-click-link");

  if (!phoneLink) return;

  phoneLink.addEventListener("click", () => {
    // 1. Send directly to GA4 via gtag
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        event_category: "engagement",
        event_label: "Footer Phone Click",
        lead_type: "phone_call",
        value: 250.0,
        currency: "USD",
      });
      console.log("GA4 Event Dispatched: generate_lead (Phone Click)");
    }

    // 2. DataLayer push (for GTM / backup)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "phone_call_clicked",
      clickLocation: "footer",
      estimatedLeadValue: 250.0,
    });
  });
}

/**
 * Tracks incremental scroll depth thresholds (25%, 50%, 75%, 90%) as engagement signals.
 */
function initScrollTracking() {
  const thresholds = [25, 50, 75, 90];
  const reached = new Set();

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Calculate percent scrolled
    const totalScrollable = docHeight - windowHeight;
    if (totalScrollable <= 0) return;

    const scrollPercent = Math.round((scrollTop / totalScrollable) * 100);

    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !reached.has(threshold)) {
        reached.add(threshold);

        // 1. Send directly to GA4 via gtag
        if (typeof gtag === "function") {
          gtag("event", "scroll_depth", {
            event_category: "engagement",
            percent_scrolled: threshold,
          });
          console.log(`GA4 Event Dispatched: scroll_depth (${threshold}%)`);
        }

        // 2. DataLayer push (for GTM / backup)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "scroll_threshold_reached",
          scrollPercent: threshold,
        });
      }
    });
  });
}
