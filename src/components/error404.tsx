import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

export const Error404 = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col justify-center items-center text-center gap-6 px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <MdErrorOutline className="w-12 h-12 text-red-500" />
        </div>

        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="px-8 py-3 bg-[#0058BC] hover:bg-blue-700 text-white font-semibold rounded-full transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
