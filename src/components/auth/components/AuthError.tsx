import { type AuthError as AuthErrorType } from "../types/auth";

interface AuthErrorComponentProps {
  error: AuthErrorType;
}

export const AuthErrorComponent = ({ error }: AuthErrorComponentProps) => (
  <div className="min-h-screen flex items-center justify-center bg-[#051527]">
    <div className="text-center text-red-400">
      <p>Error: {error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  </div>
);