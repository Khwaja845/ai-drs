type Props = {
  label: string;
  loadingLabel: string;
  loading: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function ActionButton({
  label,
  loadingLabel,
  loading,
  onClick,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-200 active:scale-98 transition-all duration-300 animate-bounce-in disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2 animate-pulse">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
