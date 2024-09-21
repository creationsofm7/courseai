import React from "react";
import Link from "next/link";

import { SignOut } from "./signout";
import { auth } from "../../app/auth";

type propstype = {
  color: string;
  textcolor: string;
};


export default async function Navbar(props: propstype) {

  const session = await auth();
  return (
    <nav className={`bg-${props.color} text-${props.textcolor} p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          course.ai
        </Link>
        <h1 className="text-2xl font-medium">
          Learning Center
        </h1>
        <div className="flex items-center gap-2 space-x-4">
          
          {session ? <SignOut /> : null}
          
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition duration-300">
            Login
          </button> */}
        </div>
      </div>
    </nav>
  );
};


