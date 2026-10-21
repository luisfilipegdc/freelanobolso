"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { REMEMBER_COOKIE } from "@/lib/supabase/env";
import { AREAS_DE_ATUACAO, FAIXAS_DE_FATURAMENTO, TAMANHOS_DE_EQUIPE } from "@/lib/opcoes";

export type FormState = {
  error?: string;
  message?: string;
  values?: Record<string, string>;
};

const MENSAGENS: Record<string, string> = {
  invalid_credentials: "Email ou senha incorretos.",
  email_not_confirmed: "Confirme seu email antes de entrar. Enviamos um link para a sua caixa de entrada.",
  user_already_exists: "Já existe uma conta com este email. Que tal entrar?",
  email_exists: "Já existe uma conta com este email. Que tal entrar?",
  weak_password: "Senha fraca. Ela deve ter pelo menos 8 caracteres.",
  email_address_invalid: "Este email não parece válido.",
  over_email_send_rate_limit: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  over_request_rate_limit: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  same_password: "A nova senha precisa ser diferente da atual.",
  provider_disabled: "O login com Google ainda não está ativado.",
  validation_failed: "O login com Google ainda não está ativado.",
};

function traduzirErro(error: { code?: string; message: string }) {
  return (error.code && MENSAGENS[error.code]) || "Algo deu errado. Tente novamente em instantes.";
}

async function origem() {
  const h = await headers();
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

export async function entrar(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = texto(formData, "email");
  const password = String(formData.get("password") ?? "");
  const lembrar = formData.get("lembrar") === "on";

  if (!email || !password) return { error: "Preencha email e senha.", values: { email } };

  // Precisa existir antes do signIn: o cliente do servidor lê este cookie ao gravar a sessão.
  (await cookies()).set(REMEMBER_COOKIE, lembrar ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: traduzirErro(error), values: { email } };

  redirect("/inicio");
}

export async function entrarComGoogle(): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await origem()}/auth/callback?next=/inicio` },
  });
  if (error || !data.url) redirect("/entrar?erro=google");
  redirect(data.url);
}

export async function criarConta(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = texto(formData, "name");
  const company_name = texto(formData, "company_name");
  const email = texto(formData, "email");
  const password = String(formData.get("password") ?? "");
  const values = { name, company_name, email };

  if (!name) return { error: "Informe o seu nome.", values };
  if (!email) return { error: "Informe o seu email.", values };
  if (password.length < 8) return { error: "A senha deve ter pelo menos 8 caracteres.", values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, company_name },
      emailRedirectTo: `${await origem()}/auth/callback?next=/criar-conta/sobre-voce`,
    },
  });
  if (error) return { error: traduzirErro(error), values };

  // Com confirmação de email ligada, o Supabase não devolve sessão.
  if (!data.session) {
    return {
      message: `Conta criada! Enviamos um link de confirmação para ${email}. Clique nele para começar o seu teste grátis.`,
    };
  }

  redirect("/criar-conta/sobre-voce");
}

export async function salvarSobreVoce(_prev: FormState, formData: FormData): Promise<FormState> {
  const areas = formData
    .getAll("areas")
    .map(String)
    .filter((a) => (AREAS_DE_ATUACAO as readonly string[]).includes(a));
  const team = texto(formData, "team_size");
  const revenue = texto(formData, "monthly_revenue_range");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar");

  const { error } = await supabase
    .from("profiles")
    .update({
      areas,
      team_size: (TAMANHOS_DE_EQUIPE as readonly string[]).includes(team) ? team : null,
      monthly_revenue_range: (FAIXAS_DE_FATURAMENTO as readonly string[]).includes(revenue) ? revenue : null,
    })
    .eq("id", auth.user.id);
  if (error) return { error: "Não conseguimos salvar suas respostas. Tente novamente." };

  redirect("/inicio");
}

export async function esqueciSenha(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = texto(formData, "email");
  if (!email) return { error: "Informe o seu email.", values: { email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origem()}/auth/callback?next=/redefinir-senha`,
  });
  if (error) return { error: traduzirErro(error), values: { email } };

  // Mesma resposta exista ou não a conta, para não revelar quem é cadastrado.
  return { message: "Se existir uma conta com este email, você vai receber um link para criar uma nova senha." };
}

export async function redefinirSenha(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "A senha deve ter pelo menos 8 caracteres." };
  if (password !== confirm) return { error: "As senhas não conferem." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: traduzirErro(error) };

  redirect("/inicio");
}

export async function sair(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
