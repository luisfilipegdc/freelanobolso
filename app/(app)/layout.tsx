import { AccountCard } from "@/components/freelanobolso/account-card";
import { AppSidebar } from "@/components/freelanobolso/app-sidebar";
import { getPerfil } from "@/lib/auth";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const perfil = await getPerfil();

  return (
    <div className="min-h-dvh bg-branco lg:flex">
      <AppSidebar
        accountCard={
          <AccountCard name={perfil.name} email={perfil.email} avatarUrl={perfil.avatar_url} points={perfil.points} />
        }
      />
      <main className="min-w-0 flex-1 bg-neutro-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
