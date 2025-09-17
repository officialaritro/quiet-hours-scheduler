import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-semibold mb-4">Create Account</h1>
        {/* If using credentials, add form here.
            If only magic link/email sign-in is enabled, redirect to /auth/signin */}
        <p className="text-sm text-gray-600 mb-4">
          Sign-up is not required. Use{" "}
          <Link href="/auth/signin" className="text-blue-600">
            Sign In
          </Link>{" "}
          with your email to continue.
        </p>
      </div>
    </div>
  );
}
