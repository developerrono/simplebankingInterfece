import React, { useState, useEffect } from "react";

// ✅ 1. Define a custom event type for TypeScript (since it's missing from DOM types)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function JamiiBankInstallPrompt() {
  // ✅ 2. Give useState the correct type (or null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  // ✅ 3. Proper event listener
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ✅ 4. Properly defined install click handler
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    console.log("User response to the install prompt:", result.outcome);
    setShowButton(false);
  };

  // ✅ 5. Return your button UI
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">🏦 Jamii Bank App</h1>
      <p className="text-gray-600 mb-4">Secure mobile banking interface.</p>

      {showButton && (
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
        >
          Install App
        </button>
      )}
    </div>
  );
}

export default JamiiBankInstallPrompt;
