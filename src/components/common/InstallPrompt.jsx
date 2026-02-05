import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const INSTALL_DISMISSED_KEY = 'intentional-week-install-dismissed';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Show popup after a short delay
      setTimeout(() => setShowPopup(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPopup(false);
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
    }
    setShowPopup(false);
    localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowPopup(false);
    localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
  };

  if (isInstalled || !showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-expand">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-balanced-teal/10 rounded-xl p-3">
            <Smartphone className="w-8 h-8 text-balanced-teal" />
          </div>
          <button
            onClick={handleDismiss}
            className="text-charcoal/40 hover:text-charcoal p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-charcoal mb-2">
          Install Intentional Week
        </h3>
        <p className="text-charcoal/60 mb-6">
          Add to your home screen for quick access and a native app experience. Works offline too!
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 bg-balanced-teal text-white px-4 py-3 rounded-xl font-medium hover:bg-balanced-teal/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-charcoal/60 hover:text-charcoal font-medium"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
