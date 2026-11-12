# Íris

**Um olhar sobre a Stellar.**

Jornal diário de Stellar, blockchain e economia digital. A Íris observa o
ecossistema, aproxima o que importa e acompanha o que mudou ao longo do tempo.
O nome, escolhido pelo usuário, une a missão espacial IRIS à ideia familiar do
olhar. A identidade é própria e não sugere vínculo com a NASA ou a SDF.

## Identidade

O símbolo é uma abertura óptica de seis lâminas com um ponto focal âmbar.
O favicon reduz a forma a um anel e um ponto. No corpo do jornal, pequenos
pontos marcam atenção editorial; o símbolo completo fica no cabeçalho e rodapé.
Escrever **Íris** com acento; usar `iris` em identificadores técnicos.

Instrument Serif dá voz à marca e à manchete da edição, com arquivo local e
licença em `src/app/fonts/`. Literata continua responsável pela leitura longa;
IBM Plex Mono organiza datas, fontes, rótulos e contagens.

## Cor e composição

Modo claro: papel #F1EDE4, texto #20242A, acento #805416.
Modo escuro: quase preto quente #1A1917, marfim #DBD6CC, acento #D6B27A.
O papel é um tom abaixo do branco-creme, e no escuro o texto é marfim, não
branco: brilho demais cansa na leitura longa.
O ponto focal do símbolo usa o mesmo amarelo #D6B27A nos dois temas.
A cor de foco adapta o contraste a cada tema. O tema segue a preferência do
sistema quando não há escolha salva; a seleção do leitor permanece guardada.

Filetes, espaço e contraste de escala organizam a leitura. Sem fundo estrelado,
nebulosa ou animação de entrada. A leitura continua em coluna de até 660px,
com 19px no desktop e 18px no celular.

## Linguagem editorial

- **Primeira luz — O dia em poucas linhas:** resumo da edição.
- **Em foco:** manchete retirada da primeira nota da seção de destaque.
- **Em observação:** caderno de pendências e apuração.
- **Além da Stellar:** caderno de contexto sobre outras redes.
- **Arquivo:** histórico, busca e filtros com nomes diretos.

A manchete só sobe quando a primeira nota de destaque já abre com um título
completo em negrito, com até 180 caracteres. Não se cria uma afirmação nova
nem se corta a frase. Quando não há título apropriado, a data é a abertura.
Dia quieto assume a ausência de matéria, com uma explicação direta.

Tom claro, atento e criterioso. A marca promete contexto, não previsão.
Estado de confirmação deve ser comunicado por texto, sem depender de cor.

## Arquivos

- `src/components/IrisMark.tsx`: símbolo usado pelo aplicativo.
- `src/app/icon.svg`: favicon simplificado.
- `public/brand/`: versões vetoriais clara, escura e monocromática.
- `public/modelo-social.html`: estúdio e capas com a identidade Íris.


## Home aprovada — novembro de 2026
A primeira página em `/` apresenta Primeira luz lateral, manchete, até dois destaques, agenda, arquivo e Além da Stellar. O botão destacado abre `/edicoes`; data e caderno são preservados na URL de entrada. Pendências ficam somente nos arquivos internos, fora da leitura e da API pública. A home usa papel #f8f5ef, grafite #2b2e35, filetes pontilhados e contraste de escala; escuro #1e2024 e marfim #d8d5cd. Imagens dependem de licença; o diagrama Byetery só aparece quando a nota descreve esse fluxo. Não há gráfico ou foto genérica para outras matérias. Manchetes e notas vêm do relatório, com no máximo três editorias noticiosas; agenda e recaps não competem pelo destaque.
