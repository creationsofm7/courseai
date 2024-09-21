
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GitBranchPlus } from 'lucide-react';
import SignInGoogle from '@/components/ui/google-sign-in';
import AnimatedQuote from '@/components/ui/quotes';





const LoginPage = () => {
  // const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <AnimatedQuote />
      <div className="p-8 bg-white rounded-lg shadow-xl w-96 max-w-md">
        
        
        <h1 className="mb-6 text-xl font-bold text-center text-gray-800">Welcome to course.ai</h1>
        
       <SignInGoogle />

        <div className="my-4 text-center relative">
          <hr className="border-gray-300" />
          <span className="px-2 bg-white text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">or</span>
        </div>

        <form className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
            Sign in with Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;