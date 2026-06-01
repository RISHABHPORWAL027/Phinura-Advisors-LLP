import { useState, type ReactNode } from "react";
import { copyTextToClipboard, openGoogleMaps } from "../utils/contactActions";

type ContactInfoActionProps = {
  action: "copy" | "maps";
  value: string;
  className?: string;
  children: ReactNode;
  hint?: string;
};

export function ContactInfoAction({
  action,
  value,
  className = "",
  children,
  hint,
}: ContactInfoActionProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleClick() {
    if (action === "maps") {
      openGoogleMaps();
      return;
    }

    const ok = await copyTextToClipboard(value);
    setFeedback(ok ? "Copied!" : "Could not copy");
    window.setTimeout(() => setFeedback(null), 2000);
  }

  const title =
    hint ??
    (action === "maps" ? "Open in Google Maps" : "Click to copy");

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      title={title}
      className={`cursor-pointer text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-container focus-visible:ring-offset-2 rounded-lg ${className}`}
    >
      {children}
      {feedback ? (
        <span className="mt-1 block text-xs font-semibold text-secondary-container">{feedback}</span>
      ) : null}
    </button>
  );
}
