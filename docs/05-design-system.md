# 05 — Design System

Base: estilo Untitled UI, traduzido para pt-BR. Tokens prontos em `design/tokens.css` e `design/tailwind.tokens.ts`.

## Logo
Wordmark "Freela no **Bolso**" (o "Bolso" em destaque na cor primária). Favicon próprio.

## Cores (estilos do Figma)
| Token | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| primaria (Indigo) | #F5F8FF | #EEF4FF | #E0EAFF | #C7D7FE | #A4BCFD | #8098F9 | #6172F3 | **#444CE7** | #3538CD | #2D31A6 | #2D3282 |
| neutro (Cinza) | #FCFCFD | #F9FAFB | #F2F4F7 | #EAECF0 | #D0D5DD | #98A2B3 | #667085 | #475467 | #344054 | #1D2939 | #101828 |
| sucesso | #F6FEF9 | #ECFDF3 | #D1FADF | #A6F4C5 | #6CE9A6 | #32D583 | #12B76A | #039855 | #027A48 | #05603A | #054F31 |
| erro | #FFFBFA | #FEF3F2 | #FEE4E2 | #FECDCA | #FDA29B | #F97066 | #F04438 | #D92D20 | #B42318 | #912018 | #7A271A |
| alerta (Atenção) | #FFFCF5 | #FFFAEB | #FEF0C7 | #FEDF89 | #FEC84B | #FDB022 | #F79009 | #DC6803 | #B54708 | #93370D | #7A2E0E |
| rosa | — | #FDF2FA | — | — | — | — | #EE46BC | #DD2590 | #C11574 | — | — |

Extras: **Bronze** #B2470A, **Bronze Escuro** #602402 (medalhas/nível), Gradiente linear (destaques). Fundo do canvas #F5F5F5; app em branco + neutro-50.

Uso: primária = elementos interativos (botões, links, inputs focados). Erro = ações destrutivas. Alerta = confirmações / "em espera". Sucesso = confirmação, tendência positiva. Rosa = tags, gráficos, ilustrações.

## Tipografia — Inter, line-height 1.5
| Estilo | Peso | px | Cor | Uso |
|---|---|---|---|---|
| h1 | Semibold | 30 | neutro-900 | Título da página |
| h2 | Semibold | 24 | neutro-900 | KPIs e gráficos |
| h3 | Semibold | 18 | neutro-900 | Títulos de seção / cards |
| h4 | Semibold | 16 | neutro-700 | Menu e abas não selecionadas |
| h4-destaque | Semibold | 16 | primaria-600 | Menu e abas selecionadas |
| h5 | Semibold | 14 | neutro-900 | Texto forte em tabela, controles |
| h5-destaque | Semibold | 14 | primaria-600 | Botões terciários, links |
| h6 | Semibold | 12 | neutro-600 | Cabeçalho de tabela |
| texto-grande | Regular | 16 | neutro-600 | Descrição de página |
| texto | Regular | 14 | neutro-600 | Texto comum |
| texto-destaque | Medium | 14 | primaria-600 | Destaque |
| texto-sucesso / -erro / -alerta / -rosa | Medium | 14 | *-600 | Estados |
| texto-pequeno | Regular | 12 | neutro-600 | Legendas |
| texto-pequeno-destaque | Medium | 12 | primaria-600 | Legendas em destaque |
| citacao | Italic | 16 | neutro-600 | Citação da tela inicial |

## Componentes recorrentes
Botões (Primary, Secondary, Tertiary, Destructive) · Inputs com label + hint text · Radio cards (PF/PJ, À vista/Parcelado) · Checkbox · Tabs · Tabela com busca + filtros · Badge de status (cores semânticas) · Avatar · Dropzone de upload · Stepper lateral (wizards) · Modal (ícone em círculo + título + texto + 2 botões) · Menu ⋯ (dropdown) · Toast de pontos · Barra de progresso de nível · Card de KPI · Empty state (ilustração + título + texto + CTA) · Sidebar com card da conta.

Ícones do Figma (página "Ícones"): calendar, clock-stopwatch, link-external, refresh-ccw, ícone radio on/off etc. → usar `lucide-react` equivalentes.
