import { cn } from "../../lib/utils"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { fetchIt } from "../../lib/api";

export default function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const login = async (credentialResponse) => {
    console.log(credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);

    // Extract user data
    const userData = {
      email: decoded.email,
      name: decoded.name,
      googleId: decoded.sub, // 'sub' is typically the Google User ID
    };

    try {
      const response = await fetchIt('/glogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData,
      });

      // const result = await response.json();

      if (response.ok) {
        // Save session in cookie for 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `session_token=${decoded.sub}; expires=${expires.toUTCString()}; path=/`;

        const request = window.indexedDB.open("MyTestDatabase", 3);
        console.log('API Success:', request);
        navigate('/discover');
        // TODO: Handle successful login on the frontend (e.g., redirect, show message)
      } else {
        console.error('API Error:', response);
        // TODO: Handle API error on the frontend
      }
    } catch (error) {
      console.error('Failed to send user data to API:', error);
      // TODO: Handle network error or other issues
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/skolens-logo.png"
          alt="Mintofolio logo"
          width={48} // Adjust size as needed
          height={48} // Adjust size as needed
          className="rounded-md"
        />
        <h1 className="text-xl font-bold  mintofolio-text chiron-goround">Mintofolio</h1>
      </div>
      <div className="grid gap-6">

        <GoogleLogin
          onSuccess={login}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4 text-gray-800 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400">
          Sign up
        </a>
      </div>
    </form>
  );
}
