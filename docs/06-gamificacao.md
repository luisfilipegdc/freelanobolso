# 06 — Gamificação

"Ser freelancer, além de rentável, também pode ser divertido!" Pontos → níveis → vantagens exclusivas para níveis altos.

## Pontos por ação (do protótipo)
| Ação | Pontos |
|---|---|
| Adicionar pessoa | +2 |
| Registrar movimentação | +1 |
| Adicionar serviço | +5 |
| Criar proposta | +5 |
| Criar projeto | +10 |
| Assinar contrato | +20 (landing: "Você ganhou 20 pontos") |

Excluir o item = remove os pontos (avisar no modal de exclusão). Registrar em `point_events`.

## Níveis
Card da conta mostra liga + nível: "Bronze - Nível 7", barra "50 de 180 pontos". Sugestão de curva (ajustar): pontos p/ próximo nível = 20 × nível + 40. Ligas: Bronze (1–9), Prata (10–19), Ouro (20+). Ao subir: modal "Parabéns, você atingiu o Nível N!…".

## Conquistas (medalhas)
| Código | Título | Descrição | Regra |
|---|---|---|---|
| desbravador | Desbravador | Quando você chegou, isso aqui era tudo mato! | Pré-cadastro antes do lançamento |
| comeco | O começo de tudo | Toda jornada tem um começo… | Completou as 3 ações do perfil |
| obrigado | Obrigado, thanks, gracias… | Esperamos que você fature milhões! :) | Assinou o Freela no Bolso |
| pra_valer | Agora é pra valer! | Primeiro projeto… lembra do overdelivery! | Iniciou 1 projeto |
| pegar_ou_largar | É pegar ou largar? | Sua primeira proposta… | Enviou 1 proposta |
| maos_a_obra | Mãos à obra! | Seu primeiro contrato foi assinado… | Assinou 1 contrato |
| adeus_solidao | Adeus solidão! | Primeira pessoa cadastrada | Cadastrou 1 pessoa |
| chora_excel | Chora, Excel! | Daqui a pouco vamos cuidar juntos das suas finanças! | Cadastrou 1 movimentação |
| vamo_fecha | E aí, vamo fechá? | 10 propostas enviadas… | Enviou 10 propostas |
| contratinho | Vai um contratinho aí? | 5 contratos assinados, você tá voando alto! | Assinou 5 contratos |
| miss_simpatia | Miss Simpatia | Mais um pessoal e já dá pra virar vereador! | Cadastrou 10 pessoas |
| tchau_planilha | Tchau, planilha! | Bye-bye pra aquela planilha antiga… | Cadastrou 10 movimentações |
| sou_rica | Porque eu sou rica!! | 10 projetos! Haja PIX, meu Brasil! | Concluiu 10 projetos |

Seed dessas linhas em `supabase/seed.sql` (tabela `achievements`). Checagem: função `check_achievements(owner)` chamada após cada `point_event`.
