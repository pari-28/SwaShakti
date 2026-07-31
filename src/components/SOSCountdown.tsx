import { useEffect, useState } from "react";

interface SOSCountdownProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function SOSCountdown({
  onComplete,
  onCancel,
}: SOSCountdownProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
  if (count <= 0) {
    onComplete();
    return;
  }

  const timer = window.setTimeout(() => {
    setCount((prev) => prev - 1);
  }, 1000);

  return () => window.clearTimeout(timer);
 // eslint-disable-next-line react-hooks/exhaustive-deps
}, [count]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-96">
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          🚨 Emergency SOS
        </h2>

        <p className="text-gray-600 mb-6">
          Sending emergency alert in...
        </p>

        <div className="text-7xl font-bold text-red-500 mb-8">
          {count}
        </div>

        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}