"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ExcluirPessoa } from "../excluir-pessoa";
import { Button } from "@/components/ui/button";

// "Criar Projeto" e "Registrar Pagamento" entram aqui nas Fases 5 e 6.
export function AcoesPessoa({ id, name }: { id: string; name: string }) {
  const [excluindo, setExcluindo] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setExcluindo(true)}>
        <Trash2 />
        Excluir
      </Button>
      <ExcluirPessoa id={id} name={name} open={excluindo} onClose={() => setExcluindo(false)} voltar />
    </>
  );
}
