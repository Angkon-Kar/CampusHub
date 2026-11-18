// client/src/utils/copyText.js

/**
 * Copies text to the user's clipboard.
 * Uses the modern navigator.clipboard API with a fallback for older browsers.
 * @param {string} text - The string to be copied.
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise.
 */
export const copyText = async (text) => {
  if (!text) return false;

  try {
    // Modern approach
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } 
    
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
    
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
};