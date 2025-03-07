"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MODERATOR", "USER", "DOCTOR"]).optional(),
});

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "ADMIN" | "MODERATOR" | "USER" | "DOCTOR";
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true); // NEW: To prevent UI flicker
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" }, // Default for non-admins
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://localhost:4000/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (data.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setValue("role", "USER");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setValue("role", "USER");
      } finally {
        setCheckingRole(false); // NEW: Ensures UI doesn't load before role check is done
      }
    };

    fetchUserRole();
  }, [setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const endpoint =
        isAdmin && data.role !== "USER"
          ? "http://localhost:4000/login/register/admin"
          : "http://localhost:4000/login/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                {...register("firstname")}
                placeholder="First Name"
              />
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                {...register("lastname")}
                placeholder="Last Name"
              />
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Show role selection only if user is an admin */}
            {isAdmin ? (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  {...register("role")}
                  className="border p-2 w-full rounded bg-white text-black dark:bg-gray-800 dark:text-white"
                >
                  <option value="USER">User</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
                )}
              </div>
            ) : (
              <input type="hidden" {...register("role")} value="USER" />
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
