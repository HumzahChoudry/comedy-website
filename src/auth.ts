import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('ENV HASH:', JSON.stringify(process.env.ADMIN_PASSWORD_HASH));
        console.log('ENV USER:', process.env.ADMIN_USERNAME);
        console.log('ENV HASH:', process.env.ADMIN_PASSWORD_HASH);
        console.log('FORM USER:', credentials.username);
        console.log('FORM PASS:', credentials.password);
        if (!credentials?.username || !credentials?.password) return null;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) return null;

        if (credentials.username !== adminUsername) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash
        );

        if (!passwordMatch) return null;

        return {
          id: "1",
          name: "Admin",
          email: "admin@comedy-site.local",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
});
