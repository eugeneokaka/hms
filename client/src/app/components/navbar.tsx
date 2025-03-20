"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface User {
  firstname: string;
  email: string;
  role: string; // Added role field
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/status", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      <Link href="/" className="text-xl font-bold text-black dark:text-white">
        Hospital
      </Link>
      {/* <div>
        
        {user?.role === "admin" && (
          <Link href="/dashboard" className="text-lg font-bold">
            Dashboard
          </Link>
        )}
      </div> */}
      <div>
        <Link href="/dashboard" className="text-lg font-bold">
          Dashboard
        </Link>
      </div>
      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold">
              {user.firstname[0].toUpperCase()}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              <Link href="/login">
                <DropdownMenuItem>Login</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button className="bg-slate-800 dark:bg-blue-500 text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";

// interface User {
//   firstname: string;
//   email: string;
// }

// export default function Navbar() {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Simulating fetching user data from an API or localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user"); // Clear user data
//     setUser(null);
//     router.push("/login");
//   };

//   return (
//     <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
//       <Link href="/" className="text-xl font-bold">
//         Hospital
//       </Link>
//       <div>
//         {user ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger className="px-3 py-2 rounded-full bg-blue-500 text-white font-bold">
//               {user.firstname[0].toUpperCase()}
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Link href="/login">
//             <Button>Login</Button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }
