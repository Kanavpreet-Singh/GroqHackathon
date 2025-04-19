import { useState, useEffect } from "react";

export const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

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

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Trigger translation when the language changes
    const googleTranslateElement = window.google.translate.TranslateElement.prototype;
    googleTranslateElement.getTranslateElement().setLanguage(event.target.value);
  };

  return (
    <div>
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="google-translate-dropdown"
        aria-label="Select Language"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="pa">Punjabi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>

      <div id="google_translate_element" className="mt-4"></div>
    </div>
  );
};
