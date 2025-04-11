"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

interface User {
  firstname: string;
  email: string;
  role: string;
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

      <div className="flex items-center gap-6">
        {/* Conditionally render Dashboard and Medicine links based on role */}
        {user && (user.role === "ADMIN" || user.role === "DOCTOR") && (
          <>
            <Link
              href="/dashboard"
              className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Dashboard
            </Link>
            <Link
              href="/medicine"
              className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Medicine
            </Link>
          </>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer hover:opacity-90 transition">
                {user.firstname[0].toUpperCase()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">{user.firstname}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
