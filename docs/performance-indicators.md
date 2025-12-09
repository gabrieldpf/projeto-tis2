## 5. Indicadores de desempenho

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| ---           | ---           | ---           | ---             | ---             |
| Taxa de match bem-sucedido | Medir a eficácia do algoritmo de matching entre empresas e desenvolvedores | Percentual de matches que resultaram em contratação efetiva | Tabelas `Matches`, `Contratacoes` | (número de matches com contratação / número total de matches gerados) * 100 |
| Tempo médio de contratação | Reduzir o tempo entre a abertura de uma vaga e a contratação do desenvolvedor | Média de dias entre a data de criação da vaga e a data de conclusão da contratação | Tabelas `Vagas`, `Contratacoes` | soma de (data_contratacao - data_abertura_vaga) / número total de contratações |
| Taxa de engajamento dos desenvolvedores | Acompanhar o engajamento dos devs com as oportunidades disponíveis na plataforma | Percentual de desenvolvedores ativos que se candidataram a pelo menos uma vaga em um período | Tabelas `Desenvolvedores`, `Candidaturas` | (número de devs com pelo menos uma candidatura no período / número total de devs ativos no período) * 100 |
| Índice de satisfação pós-contratação | Avaliar a qualidade percebida após a contratação, tanto por empresas quanto por devs | Média das avaliações dadas em contratos concluídos | Tabelas `Contratacoes`, `Avaliacoes` | soma das notas das avaliações / número total de avaliações registradas |

_Obs.: todas as informações para gerar os indicadores devem estar no modelo relacional._
