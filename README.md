# Gustmann — painel de vendas da padaria

Painel de demonstração para apresentar à padaria Gustmann. A abertura foi pensada para explicar o valor em poucos segundos: veja os indicadores, percorra o tour rápido e explore os filtros. Foi feito com HTML, CSS e JavaScript puro e pode ser aberto localmente, sem instalar programas ou iniciar um servidor.

O visual escuro usa tons de café, trigo e forno. O botão **Modo claro** alterna para uma versão clara; os gráficos acompanham a mudança. O botão **Tour de 15 segundos** apresenta o fluxo de importação, análise e exportação.


## Login demonstrativo local

Use o e-mail `gustmann@padaria.com` e a senha `fornada2026` para entrar. O botao **Sair** encerra a sessao desta aba.

Este e um acesso de demonstracao feito apenas no navegador. Como o projeto nao tem servidor, a verificacao nao protege dados nem substitui uma autenticacao real. Nao use com informacoes sensiveis.

## Como abrir

1. Mantenha `index.html`, `styles.css` e `script.js` na mesma pasta.
2. Abra `index.html` no navegador.
3. O painel abre com uma pequena base de vendas **fictícia**, identificada na própria página. Ela não representa vendas reais da Gustmann.
4. Para analisar seus dados, use **Escolher CSV** e selecione o arquivo no computador. A leitura ocorre no navegador; o arquivo não é enviado a um servidor.

Chart.js 4.4.7, Papa Parse 5.4.1, SheetJS 0.20.3, fontes e fotos ilustrativas são carregados de fontes externas. É necessária uma conexão com a internet para que gráficos, importação de arquivos, fontes e imagens funcionem. Sem conexão, o conteúdo, os indicadores e a tabela inicial continuam disponíveis, mas esses recursos externos podem não carregar. O SheetJS é carregado pelo [CDN oficial](https://docs.sheetjs.com/docs/getting-started/installation/standalone/).

As três fotos da vitrine são ilustrativas, não são fotos da loja nem do catálogo real da Gustmann. São hospedadas no Unsplash e aparecem com créditos na página:

- [Pães na vitrine — Farhad Ibrahimzade](https://unsplash.com/photos/brown-bread-on-clear-glass-display-counter-I0Vb0DejVZ0)
- [Croissant — David Thielen](https://unsplash.com/photos/a-close-up-of-a-croissant-on-a-table-njBYgZhR65o)
- [Pãezinhos de canela — Aurela Redenica](https://unsplash.com/photos/a-pile-of-cinnamon-rolls-WqFUzmRr25A)

## Formato do CSV

O arquivo precisa ter uma linha de cabeçalho. Estas colunas são obrigatórias:

| Coluna | Tipo e significado |
| --- | --- |
| `Data` | Data da venda em `AAAA-MM-DD` ou `DD/MM/AAAA` |
| `Quantidade` | Número de unidades; zero é aceito como zero |
| `Preco_Unitario` | Preço por unidade, como `12.50` ou `12,50` |

Estas colunas são opcionais; quando ausentes ou vazias, o registro é mantido e o campo aparece como “Não informado”:

| Coluna | Tipo e significado |
| --- | --- |
| `Cliente` | Nome do cliente ou empresa atendida. |
| `Periodo` | Parte do dia: Manhã, Tarde ou Noite. |
| `Produto` | Nome do item vendido |
| `Categoria` | Grupo do item, por exemplo Pães, Confeitaria, Salgados, Bolos ou Bebidas |
| `Forma_Pagamento` | Meio de pagamento |

Os cabeçalhos também reconhecem nomes comuns como `Item`, `Qtd`, `Preço unitário` e `Pagamento`. `dados-exemplo.csv` mostra um arquivo compatível. Para números, a vírgula ou o ponto podem ser usados como separador decimal. Quantidades e preços negativos, datas impossíveis, campos numéricos vazios e datas vazias fazem a linha ser descartada. Zeros continuam válidos. Duplicatas não são removidas, pois cada linha é considerada um registro independente.

## Assistente de planilhas

A seção **Pergunte aos seus dados** aceita arquivos `.csv`, `.xlsx` e `.xls`. Em uma pasta de trabalho Excel com várias abas, escolha qual aba analisar. A primeira linha precisa conter os nomes das colunas; cada linha seguinte é tratada como um registro. O assistente pode listar colunas, contar linhas, somar ou calcular médias, comparar valores por categoria/cliente/produto, mostrar extremos e apontar campos vazios. Se houver colunas de quantidade e preço unitário, também calcula uma coluna auxiliar de faturamento (quantidade × preço), identificada como calculada.

Este painel não conecta um modelo generativo nem envia dados para um serviço de IA: ele interpreta perguntas comuns e faz cálculos determinísticos no próprio navegador. As respostas dependem dos nomes e valores presentes no arquivo; perguntas que não puderem ser interpretadas são respondidas com os campos disponíveis, sem inventar relações ou causas.

Para usar dados do Power BI, exporte os dados do visual para CSV ou Excel e carregue a exportação. O arquivo `.pbix` não é uma planilha tabular e não pode ser analisado diretamente por este site. A exportação do Power BI respeita os filtros aplicados ao visual e tem limites de linhas definidos pelo próprio serviço; consulte [a documentação oficial de exportação](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-export-data). Conectar um relatório autenticado diretamente exige configuração de identidade e tokens do Power BI, que não devem ser guardados em um site estático.

## Indicadores e gráficos

- **Faturamento:** soma de `Quantidade × Preco_Unitario` nos registros que correspondem aos filtros.
- **Registros:** quantidade de linhas válidas no recorte atual.
- **Unidades vendidas:** soma de `Quantidade` no recorte atual.
- **Valor médio por registro:** faturamento dividido pela quantidade de registros. Como o arquivo não identifica pedidos, este valor não é apresentado como ticket médio por pedido.
- **Ritmo de vendas:** faturamento agregado por dia, em um gráfico de linhas.
- **Vendas por categoria:** faturamento agregado por categoria, em barras.

Filtros de data, cliente, período, categoria, pagamento e busca atualizam indicadores, gráficos e tabela em conjunto. Por padrão, a tabela mostra todos os registros válidos que correspondem ao recorte. Use o seletor para mostrar 10, 25 ou 50 por vez quando o arquivo for grande; os botões de paginação são ativados nesses modos. Os títulos ordenam as linhas. A exportação inclui todos os registros filtrados, mesmo quando a tabela está paginada. Linhas inválidas são contabilizadas no painel de qualidade e não aparecem como registros válidos.

## Personalizar as fotos da vitrine

Na vitrine, escolha **Trocar foto** em um dos três cartões e selecione uma imagem JPG, PNG, WebP ou AVIF de até 15 MB. A imagem é reduzida e guardada somente neste navegador; nada é enviado para um servidor. As fotos personalizadas não acompanham o site publicado nem aparecem em outros aparelhos. Use **Restaurar fotos** para voltar às imagens ilustrativas.

Cada botão **Ver vendas** busca produtos relacionados e leva aos indicadores e registros. Os atalhos usam os nomes presentes no CSV carregado.

## Clientes recorrentes e períodos

O arquivo de exemplo tem 30 linhas fictícias, com seis clientes recorrentes e vendas nos períodos Manhã e Tarde. Nomes e valores são ilustrativos; não representam clientes nem receitas reais da Gustmann.

Os campos opcionais `Cliente` e `Periodo` informam o nome do cliente e a parte do dia (por exemplo, Manhã, Tarde ou Noite). Quando estão ausentes, a linha é mantida como `Não informado`. Os filtros de cliente e período atualizam em conjunto os indicadores, gráficos e a tabela.

**Faturamento pela manhã** soma `Quantidade x Preco_Unitario` nas linhas marcadas como Manhã, respeitando os filtros ativos. **Ganhos por cliente e período** agrega o faturamento de cada cliente por parte do dia. A tabela e a exportação incluem `Cliente` e `Periodo`.

## Publicar como site

Publique os cinco arquivos do projeto (`index.html`, `styles.css`, `script.js`, `dados-exemplo.csv` e `README.md`) em um serviço de hospedagem de arquivos estáticos, mantendo-os na mesma pasta. Também é possível abrir `index.html` diretamente no computador. Os dados importados pelo usuário ficam no navegador e não são publicados junto com a página.
