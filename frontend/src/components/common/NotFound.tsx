import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-grow items-center justify-center">
        <div className="mx-auto text-center">
        <Frown className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Oops, page not found!</h1>
        <p className="mt-4 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Don't worry, we're here to help.
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