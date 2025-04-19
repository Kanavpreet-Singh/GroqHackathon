import { useEffect } from "react";

export const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Inject Google Translate initialization function into global scope
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,pa,es,fr", // Add more languages if needed
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // Dynamically load the Google Translate script
    const addScript = document.createElement("script");
    addScript.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    // Cleanup script on unmount
    return () => {
      document.body.removeChild(addScript);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="google-translate-container">
      <div id="google_translate_element" className="h-[40px] w-[120px]" />
    </div>
  );
};
