import Navbar from "@/components/ui/navbar";
import LoginPage from "./(auth)/login";
import HomePage from "./(dashboard)/creator/home";


import { auth } from "./auth";

export default async function Home() {

  const session = await auth();
  
  const just : string | null | undefined = session?.user?.name;
  
  return (
    <div className="">
      <Navbar />
      {!session ? <LoginPage /> : <HomePage username={just} />}
    </div>
  )
      
    
  
}
