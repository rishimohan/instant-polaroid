"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-lg font-semibold text-neutral-800">
          Something went wrong
        </h2>
        <p className="text-sm text-neutral-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
