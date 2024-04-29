"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  username: string;
  token?: string; // Include other properties as needed.
}

const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    if (!token) {
      if (pathname == "/auth/sign-in") {
        router.push("/auth/sign-in");
      } else if (pathname == "/auth/sign-up") {
        router.push("/auth/sign-up");
      } else {
        router.push("/auth/sign-in");
      }
      return;
    }
    const fetchUser = async () => {
      const userDataResponse = await fetch(
        `${BASE_URL}/api/auth/verify/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const status = userDataResponse.status;
      const userData = await userDataResponse.json();

      if (status == 401) {
        router.push("/auth/sign-in");
        localStorage.removeItem("token");
      } else {
        const data = userData.data;
        const user = data.user;
        setUser({
          id: user.id,
          name: user.name,
          username: user.username,
          token: token,
        });
        localStorage.setItem("token", token);
      }
    };

    fetchUser();
  }, [pathname, router, token]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
