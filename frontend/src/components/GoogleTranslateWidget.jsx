import { useEffect, useState } from "react";

export const GoogleTranslateWidget = () => {
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (!showWidget) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,pa,es,fr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Only load the script if it hasn't been loaded already
    if (!document.querySelector(".google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      addScript.className = "google-translate-script";
      document.body.appendChild(addScript);
    }

    return () => {
      // Don't remove the script as Google Translate needs it to work properly
      delete window.googleTranslateElementInit;
    };
  }, [showWidget]);

  const toggleWidget = () => {
    setShowWidget(!showWidget);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleWidget}
        className="text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
      >
        🌐 Language
      </button>

      {showWidget && (
        <div className="absolute top-full mt-2 z-50 bg-white shadow-lg rounded">
          <div id="google_translate_element" />
        </div>
      )}
    </div>
  );
};