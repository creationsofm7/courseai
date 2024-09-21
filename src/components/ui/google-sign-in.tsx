import { signIn } from "../../app/auth"
import { Button } from "../../components/ui/button"
export default function SignInGoogle() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
      className="flex justify-center items-center w-full mt-4"
    >
      <Button
        type="submit"
        className="py-2 px-4 max-w-md flex justify-center items-center bg-white hover:bg-gray-200 focus:ring-gray-500 focus:ring-offset-gray-200 text-black w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      >
        <img
          className="w-6 h-6 mr-2"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Login with Google</span>
      </Button>
    </form>
  );
}