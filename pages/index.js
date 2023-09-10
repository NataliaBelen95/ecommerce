import "tailwindcss/tailwind.css";
import { useSession, signIn, signOut } from "next-auth/react";

import Layout from "@/components/layout";

export default function Home() {
  const { data: session } = useSession();
  console.log(session?.user?.image);

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hola, {session?.user?.name} </h2>

        {session?.user && (
          <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
            <img src={session.user.image} alt={""} className="w-6 h-6" />
            {session.user.name}
          </div>
        )}
      </div>
    </Layout>
  );
}
