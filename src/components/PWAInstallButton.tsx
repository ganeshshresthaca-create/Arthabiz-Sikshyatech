import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'navbar' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // Hide when already running inside installed Android/iOS standalone app
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      {variant === 'banner' ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>{isInstallable ? 'Install Android / Mobile App' : 'Get Android / Mobile App'}</span>
          <Download className="w-3.5 h-3.5 shrink-0" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-xs transition cursor-pointer"
          title="Install Arthabiz as an Android or Mobile App"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xs:inline sm:inline">Install App</span>
        </button>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Install Arthabiz App
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Run full-screen on Android, iOS &amp; Desktop
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close install guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              {isInstallable && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-emerald-900">Ready for 1-Tap Install</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Your browser supports direct app installation.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await install();
                      if (ok) setShowGuide(false);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs shrink-0"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {!isIOS && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      Android (Chrome / Edge)
                    </span>
                  </div>
                  <ol className="space-y-2 text-slate-600 list-decimal list-inside leading-relaxed">
                    <li>
                      Open this link in <strong>Google Chrome</strong> on your Android phone.
                    </li>
                    <li className="flex items-start gap-1">
                      <span>Tap the </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-semibold">
                        <MoreVertical className="w-3 h-3 mr-0.5" /> Menu
                      </span>
                      <span> icon in the top-right corner.</span>
                    </li>
                    <li>
                      Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>, then confirm <strong>Install</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {(isIOS || !isAndroid) && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                      iPhone / iPad (Safari)
                    </span>
                  </div>
                  <ol className="space-y-2 text-slate-600 list-decimal list-inside leading-relaxed">
                    <li className="flex items-center gap-1 flex-wrap">
                      <span>Tap the</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-semibold">
                        <Share className="w-3 h-3 mr-1" /> Share
                      </span>
                      <span>button in Safari&apos;s toolbar.</span>
                    </li>
                    <li>
                      Scroll down and tap <strong>Add to Home Screen</strong>.
                    </li>
                  </ol>
                </div>
              )}

              <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Once installed, Arthabiz launches as a full-screen app on your Android home screen and syncs your practice records online with your Google account.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
