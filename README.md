# Laser Mark — Site (redesign one-page)

Redesign moderno, responsivo e animado para a **Laser Mark — "A solução em laser"**,
empresa de corte e gravação a laser, peças de reposição e consumíveis (Tatuapé,
São Paulo/SP).

O novo site é **one-page**, construído a partir do conteúdo real do site atual,
mantendo a **identidade da marca**: verde, dourado/amarelo e preto.

## ✨ Destaques

- **Single-page** responsivo, sem build e sem dependências externas de código.
- Paleta fiel à marca (`--green #34b34a`, `--gold #f2d111`, fundo preto/verde).
- Logo **LM** recriada em SVG + wordmark "LaserMark / A solução em laser".
- Tipografia sans-serif (Helvetica/Arial), como o site original.
- **Conteúdo real:** empresa, serviços (materiais de corte/gravação e gravação
  com aditivo), 4 modelos de máquinas com specs completas (R60, PL40K, T40,
  BF1312), qualidade/parceria Sitari, galeria e contato.
- **Animações:** feixes de laser + partículas no hero (canvas), reveal on scroll,
  contadores, tilt 3D, marquee de materiais, gravação a laser em SVG, barra de
  progresso e menu mobile animado.
- Acessibilidade: respeita `prefers-reduced-motion`, navegação por teclado e aria.

## 📁 Estrutura

```
index.html      → marcação e conteúdo
css/styles.css  → design system + animações
js/main.js      → interações (scroll, canvas, contadores, formulário)
```

## 🚀 Como visualizar

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## 📇 Dados de contato (reais)

- **Telefone:** (11) 2098-2525
- **E-mail:** lasermark@lasermark.com.br
- **Endereço:** Rua Guaraciaba, 495-A — Tatuapé — CEP 03404-000 — São Paulo/SP

## 🔧 Personalização

- **Cores:** variáveis no topo de `css/styles.css`.
- **Galeria:** as imagens são placeholders — substitua pelas fotos reais dos
  trabalhos (mantendo as `figcaption`).
- **Logo:** o SVG recria a logo original; para fidelidade total, troque pelo
  arquivo oficial da marca.
- O formulário é uma demonstração (sem backend); conecte a um serviço de e-mail
  ou API para produção.
