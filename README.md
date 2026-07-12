# Lasermark — Site (redesign)

Redesign moderno e animado para a **Lasermark**, empresa de marcação, gravação
e corte a laser de alta precisão (Passos/MG).

## ✨ Destaques

- **Single-page** responsivo, sem build e sem dependências externas de código
  (apenas a fonte do Google Fonts).
- Estética **high-tech dark** com paleta de laser (ciano + laranja spark).
- **Animações modernas:**
  - Canvas de partículas + feixes de laser animados no hero.
  - Reveal on scroll via `IntersectionObserver`.
  - Contadores numéricos animados.
  - Barra de progresso de scroll e brilho que segue o cursor.
  - Efeito *tilt 3D* e *spotlight* nos cards.
  - Animação de "gravação" a laser em SVG na seção Sobre.
  - Marquee de materiais, menu mobile animado e formulário com labels flutuantes.
- Acessibilidade: respeita `prefers-reduced-motion`, navegação por teclado e
  labels/aria adequados.

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

## 🔧 Personalização rápida

- **Cores:** variáveis no topo de `css/styles.css` (`--accent`, `--accent-2`…).
- **Conteúdo/contatos:** edite diretamente o `index.html` (telefone, e-mail,
  WhatsApp e endereço estão na seção `#contato`).
- O formulário é uma demonstração (sem backend); conecte a um serviço de e-mail
  ou API para produção.
