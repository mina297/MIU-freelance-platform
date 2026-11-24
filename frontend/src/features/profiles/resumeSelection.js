export const MAX_RESUME_BYTES = 5_000_000;

// Validate selection metadata only; never read or persist resume contents.
export function selectResume(files, { pdfOnly = false } = {}) {
  if (files.length !== 1) return { error: "Choose one resume file at a time." };
  const file = files[0];
  if (!(pdfOnly ? /\.pdf$/i : /\.(pdf|doc|docx)$/i).test(file.name))
    return {
      error: pdfOnly
        ? "Choose a PDF file saved from your LinkedIn profile."
        : "Choose a PDF, DOC, or DOCX file.",
    };
  if (!Number.isFinite(file.size) || file.size <= 0)
    return {
      error: pdfOnly
        ? "This file is empty. Choose another file."
        : "This file is empty. Choose another resume.",
    };
  if (file.size > MAX_RESUME_BYTES)
    return {
      error: pdfOnly
        ? "Your LinkedIn profile must be 5MB or smaller."
        : "Your resume must be 5MB or smaller.",
    };
  return { file: { name: file.name, size: file.size } };
}
