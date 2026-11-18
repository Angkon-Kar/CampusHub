// client/src/lib/ats/validator.js
// Finds contact details inside the resume text.
export const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export const LINKEDIN_RE = /linkedin\.com\/in\/[a-zA-Z0-9\-_/%]+/i;
export const GITHUB_RE = /github\.com\/[a-zA-Z0-9\-_]+/i;
const URL_RE = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/gi;

// A phone number has 10 to 15 digits. This avoids matching date ranges like "2022 - 2024".
const findPhone = (text) => {
  const candidates = text.match(/\+?\d[\d\s().-]{8,18}\d/g) || [];
  return candidates.map((c) => c.trim()).find((c) => {
    const digits = c.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15 && !/^(19|20)\d{2}\D+(19|20)\d{2}/.test(c);
  }) || null;
};

export const extractContact = (text) => {
  const email = text.match(EMAIL_RE)?.[0] || null;
  const phone = findPhone(text);
  const linkedin = text.match(LINKEDIN_RE)?.[0] || null;
  const github = text.match(GITHUB_RE)?.[0] || null;

  const urls = (text.replace(EMAIL_RE, ' ').match(URL_RE) || []).filter((u) => !/^\d+(\.\d+)*$/.test(u));
  const portfolio =
    urls.find(
      (u) => !/linkedin\.com|github\.com/i.test(u) && /\.(com|dev|io|me|net|org|xyz|app|site)\b/i.test(u)
    ) || null;

  return {
    email,
    emailValid: email ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) : false,
    phone,
    phoneValid: Boolean(phone),
    linkedin,
    github,
    portfolio,
  };
};
