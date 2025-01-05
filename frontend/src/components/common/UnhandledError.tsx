import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

export default function UnhandledError() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="mx-auto text-center">
        <TriangleAlert className="mx-auto h-12 w-12 text-primary" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Oops, something went wrong!</h1>
      <p className="mt-4 text-muted-foreground">
        We apologize for the inconvenience. Please try again later or contact our support team if the issue persists.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="text-gray-500 hover:underline"
        >
          Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}