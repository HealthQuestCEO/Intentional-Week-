import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-balanced-teal to-balanced-teal/80 rounded-xl p-4 mb-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Install Intentional Week</h3>
            <p className="text-sm text-white/80 mt-1">
              Add to your home screen for quick access, offline support, and a native app experience.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleInstall}
          className="flex items-center gap-2 bg-white text-balanced-teal px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white px-4 py-2 text-sm"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

// Compact version for settings page
export function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Smartphone className="w-5 h-5" />
        <span className="text-sm">App installed</span>
      </div>
    );
  }

  if (!installPrompt) {
    return (
      <div className="text-sm text-charcoal/50">
        <p>To install: Open in Safari/Chrome → Share → Add to Home Screen</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-balanced-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-balanced-teal/90 transition-colors"
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
}

export default InstallPrompt;
