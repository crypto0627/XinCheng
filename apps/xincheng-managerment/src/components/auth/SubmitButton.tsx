"use client";

interface SubmitButtonProps {
  loading: boolean;
  text: string;
  loadingText?: string;
}

export default function SubmitButton({
  loading,
  text,
  loadingText = "Processing...",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-md ${
        loading
          ? "bg-orange-300 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      }`}
      disabled={loading}
    >
      {loading ? loadingText : text}
    </button>
  );
} 