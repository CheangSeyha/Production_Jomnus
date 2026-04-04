export const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};
