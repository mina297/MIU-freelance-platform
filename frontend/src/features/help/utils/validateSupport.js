/**
 * @param {{
 *   name: string,
 *   email: string,
 *   topic: string,
 *   subject: string,
 *   message: string,
 * }} values
 */
export function validateSupportForm(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!values.name.trim()) errors.name = "Name is required.";

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.topic) errors.topic = "Choose a support topic.";

  if (!values.subject.trim() || values.subject.trim().length < 5) {
    errors.subject = "Subject must be at least 5 characters.";
  }

  if (!values.message.trim() || values.message.trim().length < 30) {
    errors.message = "Describe the issue in at least 30 characters.";
  }

  return errors;
}
