export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4 h-12 w-12"></div>
        <p className="text-primary-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}