import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl">
        <h1 className="text-7xl md:text-9xl font-bold mb-8">EKIN</h1>
        <p className="text-3xl md:text-4xl mb-4">what did you ship?</p>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl">
          a brutally simple weekly accountability tool.<br />
          three sentences. no fluff. no bullshit.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 transition-colors text-center"
          >
            join the crew →
          </Link>
          <Link
            href="/login"
            className="border-2 border-black px-8 py-4 text-lg font-bold hover:bg-black hover:text-white transition-colors text-center"
          >
            log in
          </Link>
        </div>

        <div className="mt-16 border-t-2 border-black pt-8">
          <p className="text-sm text-gray-600 mb-4">how it works:</p>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            <li>log in every week</li>
            <li>write what you shipped (280 chars max)</li>
            <li>your team sees it</li>
            <li>repeat</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
