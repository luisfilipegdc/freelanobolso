import { LogOut } from "lucide-react";
import { LevelProgress } from "./level-progress";
import { PersonAvatar } from "./person-avatar";
import { sair } from "@/app/(auth)/actions";

/** Card da conta no rodapé do menu: "Tiago Costa · Bronze - Nível 7" + barra de pontos. */
export function AccountCard({ name, email, avatarUrl, points }: {
  name: string;
  email: string;
  avatarUrl: string | null;
  points: number;
}) {
  return (
    <div className="rounded-lg border border-neutro-200 bg-neutro-50 p-4">
      <div className="flex items-start gap-3">
        <PersonAvatar name={name} src={avatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="h5 truncate">{name}</p>
          <p className="texto-pequeno truncate">{email}</p>
        </div>
        <form action={sair}>
          <button
            type="submit"
            className="rounded-md p-1.5 text-neutro-500 hover:bg-neutro-100 hover:text-neutro-700"
            aria-label="Sair da conta"
            title="Sair da conta"
          >
            <LogOut className="size-5" />
          </button>
        </form>
      </div>
      <div className="mt-4">
        <LevelProgress points={points} />
      </div>
    </div>
  );
}
