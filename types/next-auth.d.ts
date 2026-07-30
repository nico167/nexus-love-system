import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      role: "admin" | "vip";
    };
  }

  interface User {
    username: string;
    role: "admin" | "vip";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "admin" | "vip";
  }
}
