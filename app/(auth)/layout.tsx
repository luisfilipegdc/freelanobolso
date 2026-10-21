import { Logo } from "@/components/freelanobolso/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutro-50">
      <header className="px-4 py-6 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-12 sm:items-center">
        <div className="w-full max-w-[440px] rounded-xl border border-neutro-200 bg-branco p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
