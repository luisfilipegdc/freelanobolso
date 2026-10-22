import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Busca da listagem: formulário GET que mantém os outros filtros da URL. */
export function SearchInput({
  placeholder,
  defaultValue,
  hidden,
}: {
  placeholder: string;
  defaultValue?: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form role="search" className="relative w-full sm:max-w-80">
      {Object.entries(hidden ?? {}).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-neutro-500" />
      <Input
        name="q"
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="pl-10"
        aria-label={placeholder}
      />
    </form>
  );
}
