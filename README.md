# Rocket Telhados

Site institucional responsivo da Rocket Telhados, com portfólio de obras, informações sobre serviços e contato comercial direto pelo WhatsApp.

## Executar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

## Verificar e gerar os arquivos para hospedagem

```bash
npm run typecheck
npm run lint
npm run build
```

O build estático é gerado em `out/` e pode ser hospedado em Cloudflare Pages ou serviço estático compatível. Aponte o domínio para a pasta exportada conforme as instruções da hospedagem.

## Contato e conteúdo

- Telefone, WhatsApp, e-mail, cidade e Instagram: `src/config/site.ts`.
- Imagens, textos alternativos e categorias: `src/config/site.ts`.
- Conteúdo, galeria e fluxo de orçamento: `src/app/page.tsx`.
- Metadados de busca e compartilhamento: `src/app/layout.tsx`.
- Identidade visual e responsividade: `src/app/globals.css`.
- Origem e créditos das fotos: `IMAGE_SOURCES.md`.

Os CTAs de contato abrem `wa.me` com uma mensagem inicial. O formulário monta uma mensagem com os dados preenchidos e abre a conversa; o visitante revisa e envia pelo próprio WhatsApp. O site não recebe nem armazena os dados do formulário.

As fotos usadas na galeria estão em `public/images/obras/`. Os arquivos-fonte recuperados estão em `references/source-images/`; consulte `IMAGE_SOURCES.md` para proveniência e observações de resolução.

## Publicação

O projeto gera o site estático, mas não faz deploy por conta própria. Configure o domínio e a hospedagem no provedor escolhido. O domínio oficial não está codificado nos metadados enquanto não estiver definido.
