// Email signup form handler
(function () {
  "use strict";

  // Initialize all email signup forms on the page
  function initEmailSignupForms() {
    const forms = document.querySelectorAll(".email-signup-form");

    forms.forEach(function (form) {
      // Skip if already initialized
      if (form.dataset.initialized === "true") {
        return;
      }

      form.dataset.initialized = "true";

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const button = form.querySelector(".email-signup-button");
        const input = form.querySelector(".email-signup-input");
        const message = form.querySelector(".email-signup-message");
        const buttonText = button.querySelector(".button-text");
        const buttonSpinner = button.querySelector(".button-spinner");
        const buttonSuccess = button.querySelector(".button-success");
        const buttonError = button.querySelector(".button-error");
        const apiUrl = form.dataset.apiUrl;
        const email = input.value.trim();

        // Reset states
        message.textContent = "";
        message.className = "email-signup-message";
        button.classList.remove("success", "error");

        // Show loading state
        buttonText.style.display = "none";
        buttonSpinner.style.display = "block";
        buttonSuccess.style.display = "none";
        buttonError.style.display = "none";
        button.disabled = true;

        try {
          await fetch(apiUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          });

          // With no-cors, we can't read the response, so assume success if no error thrown
          buttonSpinner.style.display = "none";
          buttonSuccess.style.display = "block";
          button.classList.add("success");
          message.textContent = "Successfully subscribed!";
          message.classList.add("success");

          // Clear input
          input.value = "";

          // Reset after 3 seconds
          setTimeout(function () {
            buttonSuccess.style.display = "none";
            buttonText.style.display = "block";
            button.classList.remove("success");
            button.disabled = false;
            message.textContent = "";
            message.className = "email-signup-message";
          }, 3000);
        } catch (error) {
          // Only network errors will be caught here
          console.error("Email signup error:", error);
          buttonSpinner.style.display = "none";
          buttonError.style.display = "block";
          button.classList.add("error");
          message.textContent = "Something went wrong. Please try again.";
          message.classList.add("error");

          // Reset after 3 seconds
          setTimeout(function () {
            buttonError.style.display = "none";
            buttonText.style.display = "block";
            button.classList.remove("error");
            button.disabled = false;
            message.textContent = "";
            message.className = "email-signup-message";
          }, 3000);
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmailSignupForms);
  } else {
    initEmailSignupForms();
  }

  // Re-initialize if new forms are added dynamically
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          initEmailSignupForms();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
