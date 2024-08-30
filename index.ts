import copy from "copy-to-clipboard";
import React from 'react'

const useCopy = () => {
  return (text: string, ref?: React.RefObject<HTMLElement>): Promise<void> => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }

    return handleFallbackCopy(text, ref?.current);
  };
};

export default useCopy;

const handleFallbackCopy = (
  text: string,
  context?: HTMLElement | null
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid influencing the layout by positioning it off-screen
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.left = "-1000px";

    // Insert the textarea as a sibling of the context element, if provided
    if (context && context.parentNode) {
      context.parentNode.insertBefore(textArea, context.nextSibling);
    } else {
      document.body.appendChild(textArea);
    }

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        console.log("Text copied using fallback!");
        resolve(); // Resolve the promise if copy was successful
      } else {
        const fallbackSuccessful = copy(text);
        if (fallbackSuccessful) {
          console.log("Text copied using copy-to-clipboard!");
          resolve(); // Resolve the promise if the fallback was successful
        } else {
          reject(new Error("Failed to copy text using fallback method."));
        }
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      reject(err); // Reject the promise if there was an error
    } finally {
      // Clean up the textarea after copying
      if (textArea.parentNode) {
        textArea.parentNode.removeChild(textArea);
      }
    }
  });
};
