/**
 * Meridian Dental Arts - Core Frontend Sandbox Script
 * Manages appointment conversions and asynchronous GTM tracking pipelines.
 */

document.addEventListener("DOMContentLoaded", () => {
  initFormTracking();
  initFaqAccordion();
  initMobileMenuAutoClose();
});

/**
 * Automatically collapses the mobile hamburger drawer when a section link is targeted.
 */
function initMobileMenuAutoClose() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll("nav a");

  if (!menuToggle) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Unchecks the hidden checkbox, triggering the CSS transition to collapse the menu drawer
      menuToggle.checked = false;
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

    summary.addEventListener("click", (event) => {
      // Close all other open FAQ items except the one clicked
      if (!item.hasAttribute("open")) {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.removeAttribute("open");
          }
        });

        // Marketing Analytics Step: Track which questions interest patients most
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "faq_question_opened",
          questionText: summary.textContent.trim(),
        });
        console.log(
          `Tracked FAQ Engagement Event: ${summary.textContent.trim()}`,
        );
      }
    });
  });
}
