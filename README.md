# SportsTips - Palpites Profissionais

Uma aplicação Next.js moderna para palpites de esportes com interface mobile-first e design responsivo.

## 🚀 Funcionalidades

- **Interface Mobile-First**: Design otimizado para dispositivos móveis
- **Palpites em Tempo Real**: Odds atualizadas automaticamente
- **Filtros Inteligentes**: Categorização por esporte e tipo de palpite
- **Sistema Premium**: Destaque para palpites exclusivos
- **Navegação Intuitiva**: Bottom navigation e FAB
- **Estatísticas em Tempo Real**: ROI, acertos e contadores

## 🛠️ Tecnologias

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **CSS Modules**: Estilização modular e responsiva
- **React Hooks**: Gerenciamento de estado moderno

## 📱 Design

- **Mobile-First**: Otimizado para telas de 375px a 390px
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Animações Suaves**: Transições e micro-interações
- **Acessibilidade**: Contraste e navegação por teclado

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Abrir no navegador**:
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 🎯 Estrutura do Projeto

```
sportstips/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── Header.tsx         # Cabeçalho com stats
│   ├── FilterTabs.tsx     # Abas de filtro
│   ├── TipCard.tsx        # Card de palpite
│   ├── BottomNavigation.tsx # Navegação inferior
│   └── FloatingActionButton.tsx # Botão flutuante
├── types/                 # Definições TypeScript
│   └── index.ts          # Interfaces e tipos
└── package.json          # Dependências e scripts
```

## 🎨 Componentes Principais

### Header
- Logo e notificações
- Estatísticas em tempo real (acertos, ROI, contadores)

### FilterTabs
- Filtros por categoria (Todos, Premium, Futebol, etc.)
- Scroll horizontal responsivo

### TipCard
- Informações do jogo
- Palpite principal
- Odds de diferentes casas
- Destaque para palpites premium

### BottomNavigation
- Navegação principal da app
- Ícones e labels

### FloatingActionButton
- Acesso rápido a funcionalidades premium

## 🔧 Funcionalidades Implementadas

- ✅ Filtros dinâmicos por categoria
- ✅ Navegação entre seções
- ✅ Interações com cards de palpites
- ✅ Atualização automática de odds
- ✅ Sistema de notificações
- ✅ Acesso premium
- ✅ Design responsivo
- ✅ Animações e transições
- ✅ TypeScript com tipagem completa

## 📱 Responsividade

- **Mobile**: 375px - 390px (iPhone SE, iPhone 12/13/14)
- **Tablet**: Adaptação automática
- **Desktop**: Layout centralizado com max-width

## 🎯 Próximos Passos

- [ ] Integração com API real
- [ ] Sistema de autenticação
- [ ] PWA (Progressive Web App)
- [ ] Push notifications
- [ ] Analytics e métricas
- [ ] Testes automatizados
