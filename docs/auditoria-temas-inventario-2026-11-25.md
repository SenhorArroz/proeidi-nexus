# Inventário de contraste dos temas do ProEIDI Nexus

[Voltar ao relatório](./auditoria-temas-2026-11-25.md)

Coleta de 25 de novembro de 2026, a partir do commit `1282ce0`. Cada registro de contraste usa o menor valor por linha, elemento e propriedade visual. O marcador “dinâmico” indica alguma classe ou estilo que depende de execução no elemento ou em um ancestral local. O traço indica que a bancada não registrou um valor abaixo do limiar naquele tema para aquele item. As razões foram comparadas antes do arredondamento para exibição.

## Resultados abaixo dos limiares

Os itens identificam pontos para revisão. A bancada monta o JSX e seus ancestrais lexicais com o CSS compilado. O fundo real pode depender de um componente pai, imagem, variável, opção de banco ou estado. A aplicação dos critérios de ícones e contornos depende de o indicador carregar informação necessária. Abreviações dos estados e larguras aparecem nas células com as razões.

| Local | Propriedade | Claro | Escuro | Contexto dinâmico |
| --- | --- | --- | --- | --- |
| [_components/botaoVoltar.tsx:12](../src/app/_components/botaoVoltar.tsx#L12) | foco · `Link` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/diretoria/form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) | contorno · `input` | 1,098:1 · normal · 1366 px · `#dff2fe/#f8fafc` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [_components/diretoria/form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) | foco · `input` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/diretoria/page-intro.tsx:20](../src/app/_components/diretoria/page-intro.tsx#L20) | texto · `p` | 3,569:1 · normal · 1366 px · `#e0f2fe/#0284c7` | 3,569:1 · normal · 1366 px · `#e0f2fe/#0284c7` | — |
| [_components/diretoria/page-intro.tsx:22](../src/app/_components/diretoria/page-intro.tsx#L22) | texto · `div` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | — |
| [_components/diretoria/page-intro.tsx:28](../src/app/_components/diretoria/page-intro.tsx#L28) | foco · `Link` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/diretoria/page-intro.tsx:28](../src/app/_components/diretoria/page-intro.tsx#L28) | texto · `Link` | — | 3,155:1 · normal · 1366 px · `#0369a1/#0b1220` | — |
| [_components/diretoria/people-management-card.tsx:45](../src/app/_components/diretoria/people-management-card.tsx#L45) | texto · `div` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [_components/diretoria/people-management-card.tsx:58](../src/app/_components/diretoria/people-management-card.tsx#L58) | texto · `p` | — | 3,120:1 · normal · 1366 px · `#ca3500/#162033` | — |
| [_components/diretoria/people-management-card.tsx:63](../src/app/_components/diretoria/people-management-card.tsx#L63) | texto · `p` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) | foco · `button` | 2,135:1 · foco · 1366 px · `#fe9a00/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) | ícone · `KeyRound` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:71](../src/app/_components/diretoria/people-management-card.tsx#L71) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:79](../src/app/_components/diretoria/people-management-card.tsx#L79) | ícone · `Loader2` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:82](../src/app/_components/diretoria/people-management-card.tsx#L82) | foco · `button` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:88](../src/app/_components/diretoria/people-management-card.tsx#L88) | ícone · `Pencil` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [_components/diretoria/people-management-card.tsx:98](../src/app/_components/diretoria/people-management-card.tsx#L98) | ícone · `Trash2` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/people-management-card.tsx:111](../src/app/_components/diretoria/people-management-card.tsx#L111) | ícone · `DoorOpen` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [_components/diretoria/people-management-card.tsx:112](../src/app/_components/diretoria/people-management-card.tsx#L112) | texto · `span` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [_components/diretoria/people-management-card.tsx:117](../src/app/_components/diretoria/people-management-card.tsx#L117) | texto · `p` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/presence-grid.tsx:74](../src/app/_components/diretoria/presence-grid.tsx#L74) | texto · `option` | 4,351:1 · normal · 1366 px · `#62748e/#f1f5f9` | — | — |
| [_components/diretoria/presence-grid.tsx:101](../src/app/_components/diretoria/presence-grid.tsx#L101) | texto · `span` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [_components/diretoria/presence-grid.tsx:168](../src/app/_components/diretoria/presence-grid.tsx#L168) | texto · `span` | — | 1,016:1 · normal · 390 px · `#dbe7f5/#e2e8f0` | — |
| [_components/diretoria/presence-grid.tsx:194](../src/app/_components/diretoria/presence-grid.tsx#L194) | texto · `p` | — | 3,120:1 · normal · 390 px · `#ca3500/#162033` | — |
| [_components/diretoria/presence-grid.tsx:233](../src/app/_components/diretoria/presence-grid.tsx#L233) | texto · `p` | — | 3,120:1 · normal · 1366 px · `#ca3500/#162033` | — |
| [_components/diretoria/project-code-modal.tsx:71](../src/app/_components/diretoria/project-code-modal.tsx#L71) | ícone · `FileText` | — | 2,726:1 · normal · 1366 px · `#ca3500/#1e2b40` | — |
| [_components/diretoria/project-code-modal.tsx:80](../src/app/_components/diretoria/project-code-modal.tsx#L80) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [_components/diretoria/project-code-modal.tsx:88](../src/app/_components/diretoria/project-code-modal.tsx#L88) | ícone · `X` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [_components/diretoria/project-code-modal.tsx:97](../src/app/_components/diretoria/project-code-modal.tsx#L97) | contorno · `input` | 1,486:1 · normal · 1366 px · `#cad5e2/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [_components/diretoria/project-code-modal.tsx:97](../src/app/_components/diretoria/project-code-modal.tsx#L97) | foco · `input` | 1,147:1 · foco · 1366 px · `#ffedd4/#ffffff` | — | — |
| [_components/diretoria/project-code-modal.tsx:97](../src/app/_components/diretoria/project-code-modal.tsx#L97) | placeholder · `input` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [_components/diretoria/project-code-modal.tsx:112](../src/app/_components/diretoria/project-code-modal.tsx#L112) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [_components/diretoria/project-code-modal.tsx:116](../src/app/_components/diretoria/project-code-modal.tsx#L116) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [_components/diretoria/project-code-modal.tsx:116](../src/app/_components/diretoria/project-code-modal.tsx#L116) | texto · `button` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [_components/diretoria/project-code-modal.tsx:119](../src/app/_components/diretoria/project-code-modal.tsx#L119) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [_components/ferramentaCerd.tsx:29](../src/app/_components/ferramentaCerd.tsx#L29) | ícone · `ChevronRight` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | — | — |
| [_components/force-password-change.tsx:95](../src/app/_components/force-password-change.tsx#L95) | texto · `p` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | — |
| [_components/force-password-change.tsx:104](../src/app/_components/force-password-change.tsx#L104) | contorno · `input` | 1,179:1 · normal · 1366 px · `#e2e8f0/#f8fafc` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [_components/force-password-change.tsx:104](../src/app/_components/force-password-change.tsx#L104) | foco · `input` | 1,149:1 · foco · 1366 px · `#dff2fe/#ffffff` | — | — |
| [_components/force-password-change.tsx:116](../src/app/_components/force-password-change.tsx#L116) | foco · `button` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [_components/force-password-change.tsx:133](../src/app/_components/force-password-change.tsx#L133) | texto · `span` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [_components/force-password-change.tsx:144](../src/app/_components/force-password-change.tsx#L144) | contorno · `input` | 1,179:1 · normal · 1366 px · `#e2e8f0/#f8fafc` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [_components/force-password-change.tsx:144](../src/app/_components/force-password-change.tsx#L144) | foco · `input` | 1,149:1 · foco · 1366 px · `#dff2fe/#ffffff` | — | — |
| [_components/force-password-change.tsx:156](../src/app/_components/force-password-change.tsx#L156) | foco · `button` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [_components/force-password-change.tsx:175](../src/app/_components/force-password-change.tsx#L175) | texto · `span` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [_components/force-password-change.tsx:191](../src/app/_components/force-password-change.tsx#L191) | foco · `button` | 1,330:1 · foco · 1366 px · `#b8e6fe/#ffffff` | — | — |
| [_components/force-password-change.tsx:191](../src/app/_components/force-password-change.tsx#L191) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [_components/home/contatos.tsx:51](../src/app/_components/home/contatos.tsx#L51) | texto · `h2` | 3,850:1 · normal · 1366 px · `#0084d1/#f9fafb` | — | — |
| [_components/home/inscricoes.tsx:91](../src/app/_components/home/inscricoes.tsx#L91) | texto · `p` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — | — |
| [_components/home/inscricoes.tsx:151](../src/app/_components/home/inscricoes.tsx#L151) | texto · `svg` | 3,501:1 · normal · 1366 px · `#0084d1/#dff2fe` | — | — |
| [_components/home/inscricoes.tsx:159](../src/app/_components/home/inscricoes.tsx#L159) | texto · `p` | 4,022:1 · normal · 1366 px · `#0084d1/#ffffff` | — | — |
| [_components/home/onde.tsx:89](../src/app/_components/home/onde.tsx#L89) | texto · `svg` | 3,501:1 · normal · 1366 px · `#0084d1/#dff2fe` | — | — |
| [_components/screen-tour.tsx:275](../src/app/_components/screen-tour.tsx#L275) | foco · `button` | 2,759:1 · foco · 1366 px · `#ff6900/#f8fafc` | — | — |
| [_components/screen-tour/painel-tour.tsx:99](../src/app/_components/screen-tour/painel-tour.tsx#L99) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [_components/screen-tour/painel-tour.tsx:124](../src/app/_components/screen-tour/painel-tour.tsx#L124) | contorno · `select` | 1,485:1 · normal · 1366 px · `#cbd5e1/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | Sim |
| [_components/screen-tour/painel-tour.tsx:124](../src/app/_components/screen-tour/painel-tour.tsx#L124) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [_components/screen-tour/painel-tour.tsx:166](../src/app/_components/screen-tour/painel-tour.tsx#L166) | foco · `button` | 2,179:1 · foco · 1366 px · `#00bcff/#ffffff` | — | Sim |
| [_components/sidebar.tsx:87](../src/app/_components/sidebar.tsx#L87) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar.tsx:98](../src/app/_components/sidebar.tsx#L98) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar.tsx:127](../src/app/_components/sidebar.tsx#L127) | texto · `span` | 2,881:1 · normal · 1366 px · `#ff6900/#ffffff` | — | — |
| [_components/sidebar.tsx:137](../src/app/_components/sidebar.tsx#L137) | foco · `button` | 2,797:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [_components/sidebar.tsx:146](../src/app/_components/sidebar.tsx#L146) | ícone · `PanelLeftOpen` | 2,596:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [_components/sidebar.tsx:148](../src/app/_components/sidebar.tsx#L148) | ícone · `PanelLeftClose` | 2,596:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [_components/sidebar.tsx:163](../src/app/_components/sidebar.tsx#L163) | foco · `Link` | 2,797:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [_components/sidebar.tsx:172](../src/app/_components/sidebar.tsx#L172) | ícone · `Settings` | 2,441:1 · normal · 1366 px · `#99a1af/#f0f9ff` | — | — |
| [_components/sidebar.tsx:174](../src/app/_components/sidebar.tsx#L174) | texto · `span` | 3,774:1 · normal · 1366 px · `#0084d1/#f0f9ff` | — | — |
| [_components/sidebar/acessibilidade-sidebar.tsx:23](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L23) | foco · `button` | 2,642:1 · foco · 1366 px · `#f97316/#f3f9fe` | — | — |
| [_components/sidebar/acessibilidade-sidebar.tsx:67](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L67) | foco · `Link` | 2,642:1 · foco · 1366 px · `#f97316/#f3f9fe` | — | — |
| [_components/sidebar/acessibilidade-sidebar.tsx:97](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L97) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar/acessibilidade-sidebar.tsx:110](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L110) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [_components/sidebar/acessibilidade-sidebar.tsx:113](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L113) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [_components/sidebar/navegacao-sidebar.tsx:159](../src/app/_components/sidebar/navegacao-sidebar.tsx#L159) | foco · `Link` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar/navegacao-sidebar.tsx:173](../src/app/_components/sidebar/navegacao-sidebar.tsx#L173) | texto · `span` | 3,774:1 · normal · 1366 px · `#0084d1/#f0f9ff` | 3,540:1 · normal · 1366 px · `#0084d1/#1e2b40` | — |
| [_components/sidebar/navegacao-sidebar.tsx:180](../src/app/_components/sidebar/navegacao-sidebar.tsx#L180) | texto · `p` | — | 3,198:1 · normal · 1366 px · `#0069a8/#0b1220` | — |
| [_components/sidebar/navegacao-sidebar.tsx:186](../src/app/_components/sidebar/navegacao-sidebar.tsx#L186) | foco · `Link` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar/navegacao-sidebar.tsx:195](../src/app/_components/sidebar/navegacao-sidebar.tsx#L195) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar/navegacao-sidebar.tsx:202](../src/app/_components/sidebar/navegacao-sidebar.tsx#L202) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [_components/sidebar/navegacao-sidebar.tsx:213](../src/app/_components/sidebar/navegacao-sidebar.tsx#L213) | foco · `Link` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [_components/sidebar/navegacao-sidebar.tsx:213](../src/app/_components/sidebar/navegacao-sidebar.tsx#L213) | texto · `Link` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [_components/turmaCard.tsx:89](../src/app/_components/turmaCard.tsx#L89) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | Sim |
| [_components/turmaCard.tsx:94](../src/app/_components/turmaCard.tsx#L94) | ícone · `MoreVertical` | 1,037:1 · hover · 1366 px · `#ffffff/#f9fbfd` | — | Sim |
| [_components/turmaCard.tsx:99](../src/app/_components/turmaCard.tsx#L99) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [_components/turmaCard.tsx:99](../src/app/_components/turmaCard.tsx#L99) | texto · `button` | — | 1,095:1 · normal · 1366 px · `#0f172a/#162033` | Sim |
| [_components/turmaCard.tsx:103](../src/app/_components/turmaCard.tsx#L103) | ícone · `LogIn` | — | 1,095:1 · normal · 1366 px · `#0f172a/#162033` | Sim |
| [_components/turmaCard.tsx:106](../src/app/_components/turmaCard.tsx#L106) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [_components/turmaCard.tsx:106](../src/app/_components/turmaCard.tsx#L106) | texto · `button` | 3,481:1 · hover · 1366 px · `#fb2c36/#fef2f2` | 3,481:1 · hover · 1366 px · `#fb2c36/#fef2f2` | Sim |
| [_components/turmaCard.tsx:120](../src/app/_components/turmaCard.tsx#L120) | texto · `div` | 1,046:1 · normal · 1366 px · `#ffffff/#f8fafc` | — | Sim |
| [_components/turmaCard.tsx:126](../src/app/_components/turmaCard.tsx#L126) | texto · `p` | — | 1,049:1 · normal · 1366 px · `#0f172a/#0b1220` | Sim |
| [_components/turmaCard.tsx:127](../src/app/_components/turmaCard.tsx#L127) | texto · `span` | 1,407:1 · normal · 1366 px · `#d1d5dc/#f8fafc` | — | Sim |
| [_components/turmaCard.tsx:129](../src/app/_components/turmaCard.tsx#L129) | ícone · `MapPin` | — | 1,049:1 · normal · 1366 px · `#0f172a/#0b1220` | Sim |
| [_components/turmaCard.tsx:130](../src/app/_components/turmaCard.tsx#L130) | texto · `span` | — | 1,049:1 · normal · 1366 px · `#0f172a/#0b1220` | Sim |
| [_components/turmaCard.tsx:135](../src/app/_components/turmaCard.tsx#L135) | texto · `span` | — | 1,049:1 · normal · 1366 px · `#0f172a/#0b1220` | Sim |
| [_components/turmaCard.tsx:136](../src/app/_components/turmaCard.tsx#L136) | ícone · `Users` | — | 1,049:1 · normal · 1366 px · `#0f172a/#0b1220` | Sim |
| [nexus/acessibilidade/_components/painel-contraste.tsx:17](../src/app/nexus/acessibilidade/_components/painel-contraste.tsx#L17) | ícone · `Contrast` | — | 2,726:1 · normal · 1366 px · `#ca3500/#1e2b40` | — |
| [nexus/acessibilidade/_components/painel-contraste.tsx:26](../src/app/nexus/acessibilidade/_components/painel-contraste.tsx#L26) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/acessibilidade/_components/painel-tamanho-texto.tsx:29](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L29) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/acessibilidade/_components/painel-tamanho-texto.tsx:41](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L41) | foco · `button` | — | 2,784:1 · foco · 1366 px · `#0069a8/#162033` | — |
| [nexus/acessibilidade/_components/painel-tamanho-texto.tsx:51](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L51) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/acessibilidade/_components/painel-tamanho-texto.tsx:65](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L65) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/acessibilidade/_components/painel-tema.tsx:14](../src/app/nexus/acessibilidade/_components/painel-tema.tsx#L14) | ícone · `Sun` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/acessibilidade/_components/previa-acessibilidade.tsx:7](../src/app/nexus/acessibilidade/_components/previa-acessibilidade.tsx#L7) | texto · `h2` | — | 1,025:1 · normal · 1366 px · `#052f4a/#1e2b40` | — |
| [nexus/acessibilidade/_components/previa-acessibilidade.tsx:22](../src/app/nexus/acessibilidade/_components/previa-acessibilidade.tsx#L22) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/acessibilidade/_components/theme-option.tsx:17](../src/app/nexus/acessibilidade/_components/theme-option.tsx#L17) | texto · `label` | — | 1,503:1 · normal · 1366 px · `#024a70/#1e2b40` | — |
| [nexus/acessibilidade/_components/theme-option.tsx:20](../src/app/nexus/acessibilidade/_components/theme-option.tsx#L20) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/configuracoes/_components/info-row.tsx:18](../src/app/nexus/configuracoes/_components/info-row.tsx#L18) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/configuracoes/botaoSair.tsx:8](../src/app/nexus/configuracoes/botaoSair.tsx#L8) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/configuracoes/botaoSair.tsx:8](../src/app/nexus/configuracoes/botaoSair.tsx#L8) | texto · `button` | 4,363:1 · hover · 1366 px · `#e7000b/#fef2f2` | 3,416:1 · normal · 1366 px · `#e7000b/#162033` | — |
| [nexus/configuracoes/page.tsx:36](../src/app/nexus/configuracoes/page.tsx#L36) | ícone · `Settings` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/configuracoes/page.tsx:42](../src/app/nexus/configuracoes/page.tsx#L42) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/configuracoes/page.tsx:68](../src/app/nexus/configuracoes/page.tsx#L68) | foco · `Link` | 2,680:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [nexus/configuracoes/page.tsx:74](../src/app/nexus/configuracoes/page.tsx#L74) | ícone · `ClipboardList` | — | 2,726:1 · normal · 1366 px · `#ca3500/#1e2b40` | — |
| [nexus/configuracoes/page.tsx:83](../src/app/nexus/configuracoes/page.tsx#L83) | texto · `span` | — | 3,045:1 · normal · 1366 px · `#0069a8/#0f172b` | — |
| [nexus/configuracoes/page.tsx:89](../src/app/nexus/configuracoes/page.tsx#L89) | texto · `p` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:38](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L38) | ícone · `DoorOpen` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:40](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L40) | ícone · `ChevronRight` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:42](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L42) | texto · `h3` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:48](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L48) | texto · `p` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:58](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L58) | texto · `span` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:60](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L60) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:64](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L64) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/dashboard/page.tsx:37](../src/app/nexus/dashboard/page.tsx#L37) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/dashboard/page.tsx:41](../src/app/nexus/dashboard/page.tsx#L41) | texto · `span` | 3,253:1 · normal · 1366 px · `#ffffff/#2696d8` | 3,253:1 · normal · 1366 px · `#ffffff/#2696d8` | — |
| [nexus/dashboard/page.tsx:79](../src/app/nexus/dashboard/page.tsx#L79) | ícone · `CalendarDays` | 2,887:1 · normal · 1366 px · `#ff6900/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:59](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L59) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:75](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L75) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:75](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L75) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:82](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L82) | contorno · `textarea` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:82](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L82) | placeholder · `textarea` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:90](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L90) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:90](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L90) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:115](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L115) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:144](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L144) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:144](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L144) | texto · `button` | 2,889:1 · normal · 1366 px · `#ff6467/#ffffff` | 4,281:1 · hover · 1366 px · `#fb2c36/#162033` | — |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:149](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L149) | ícone · `Trash2` | 2,889:1 · normal · 1366 px · `#ff6467/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:41](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L41) | ícone · `BookOpen` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:45](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L45) | foco · `button` | 1,000:1 · foco · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:50](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L50) | ícone · `MoreVertical` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:54](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L54) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:70](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L70) | texto · `h1` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:76](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L76) | texto · `p` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:99](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L99) | foco · `button` | 2,729:1 · foco · 1366 px · `#f97316/#fbfcfd` | — | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:99](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L99) | texto · `button` | — | 2,340:1 · hover · 1366 px · `#e5edf8/#959ca7` | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:106](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L106) | foco · `button` | 2,729:1 · foco · 1366 px · `#f97316/#fbfcfd` | — | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:111](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L111) | ícone · `ChevronLeft` | — | 1,870:1 · hover · 1366 px · `#e5edf8/#aaafb8` | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:113](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L113) | foco · `button` | 2,729:1 · foco · 1366 px · `#f97316/#fbfcfd` | — | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:118](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L118) | ícone · `ChevronRight` | — | 1,870:1 · hover · 1366 px · `#e5edf8/#aaafb8` | — |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:157](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L157) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:183](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L183) | texto · `span` | 2,809:1 · normal · 1366 px · `#ffffff/#40a3dd` | 3,372:1 · normal · 1366 px · `#c5c7cc/#066baa` | Sim |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:25](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L25) | texto · `div` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:33](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L33) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:38](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L38) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:44](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L44) | ícone · `Pencil` | 2,706:1 · hover · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:48](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L48) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:54](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L54) | ícone · `Pin` | 2,135:1 · normal · 1366 px · `#fe9a00/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:58](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L58) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:64](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L64) | ícone · `Trash2` | 2,889:1 · hover · 1366 px · `#ff6467/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:78](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L78) | texto · `a` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/confirmacao-presenca-modal.tsx:20](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L20) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/confirmacao-presenca-modal.tsx:41](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L41) | texto · `button` | 3,560:1 · normal · 1366 px · `#ffffff/#ea580c` | 3,560:1 · normal · 1366 px · `#ffffff/#ea580c` | — |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:105](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L105) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:53](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L53) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:57](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L57) | ícone · `X` | 2,365:1 · hover · 1366 px · `#99a1af/#f3f4f6` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:68](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L68) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:68](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L68) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:78](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L78) | texto · `p` | — | 1,503:1 · normal · 1366 px · `#024a70/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:84](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L84) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:95](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L95) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:106](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L106) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:117](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L117) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:128](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L128) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:139](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L139) | foco · `input` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:150](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L150) | contorno · `select` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:150](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L150) | foco · `select` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:174](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L174) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:174](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L174) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:187](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L187) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:187](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L187) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:234](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L234) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:234](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L234) | texto · `button` | 3,905:1 · hover · 1366 px · `#6a7282/#e5e7eb` | 1,012:1 · hover · 1366 px · `#dbe7f5/#e5e7eb` | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:240](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L240) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx:240](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L240) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:126](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L126) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:126](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L126) | texto · `button` | — | 2,385:1 · hover · 1366 px · `#1447e6/#162033` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:133](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L133) | ícone · `X` | — | 2,385:1 · hover · 1366 px · `#1447e6/#162033` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:135](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L135) | ícone · `Plus` | — | 2,385:1 · hover · 1366 px · `#1447e6/#162033` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:144](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L144) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:144](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L144) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:152](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L152) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:152](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L152) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:152](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L152) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:193](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L193) | foco · `button` | 2,630:1 · foco · 1366 px · `#f97316/#f0f9ff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:199](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L199) | ícone · `X` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:203](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L203) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:203](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L203) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx:244](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L244) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:59](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L59) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:76](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L76) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:76](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L76) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:83](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L83) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:83](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L83) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:91](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L91) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:91](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L91) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:135](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L135) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:141](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L141) | ícone · `Trash2` | 2,602:1 · normal · 390 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/matriz-presenca-view.tsx:83](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L83) | ícone · `CalendarDays` | — | 1,572:1 · normal · 1366 px · `#7b3306/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/matriz-presenca-view.tsx:87](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L87) | texto · `p` | — | 1,572:1 · normal · 1366 px · `#7b3306/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-desktop.tsx:23](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx#L23) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-desktop.tsx:39](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx#L39) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 3,980:1 · normal · 1366 px · `#0284c7/#162033` | Sim |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx:39](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L39) | foco · `button` | 2,803:1 · foco · 390 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx:39](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L39) | texto · `button` | — | 2,432:1 · normal · 390 px · `#0069a8/#1e2b40` | — |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx:62](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L62) | foco · `button` | 2,803:1 · foco · 390 px · `#f97316/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:190](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L190) | foco · `button` | 2,710:1 · foco · 1366 px · `#f97316/#fbfbfc` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:200](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L200) | foco · `button` | 2,710:1 · foco · 1366 px · `#f97316/#fbfbfc` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:210](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L210) | foco · `button` | 2,710:1 · foco · 1366 px · `#f97316/#fbfbfc` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:8](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L8) | texto · `div` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:20](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L20) | texto · `span` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:28](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L28) | ícone · `Users` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:32](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L32) | ícone · `ShieldCheck` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:36](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L36) | ícone · `CalendarDays` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:67](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L67) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:77](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L77) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:83](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L83) | ícone · `Search` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:84](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L84) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:84](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L84) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:97](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L97) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:106](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L106) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/dashboard/turmas/[id]/page.tsx:84](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx#L84) | ícone · `AlertTriangle` | 2,760:1 · normal · 1366 px · `#ff6900/#f8fafc` | — | — |
| [nexus/dashboard/turmas/[id]/page.tsx:150](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx#L150) | texto · `h3` | — | 1,095:1 · normal · 1366 px · `#0f172a/#162033` | Sim |
| [nexus/dashboard/turmas/[id]/page.tsx:154](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx#L154) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/_components/acesso-rapido.tsx:25](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L25) | texto · `span` | 1,000:1 · hover · 1366 px · `#ffffff/#ffffff` | — | — |
| [nexus/diretoria/_components/acesso-rapido.tsx:28](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L28) | texto · `span` | 1,053:1 · normal · 1366 px · `#dff2fe/#e6eaed` | — | — |
| [nexus/diretoria/_components/stat-mini.tsx:26](../src/app/nexus/diretoria/_components/stat-mini.tsx#L26) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:55](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L55) | ícone · `Search` | 2,490:1 · normal · 1366 px · `#99a1af/#f9fafb` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:56](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L56) | placeholder · `input` | 2,490:1 · normal · 1366 px · `#99a1af/#f9fafb` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:65](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L65) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:72](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L72) | ícone · `Loader2` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:74](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L74) | ícone · `Award` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:76](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L76) | texto · `span` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:80](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L80) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:88](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L88) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:97](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L97) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:104](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L104) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:109](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L109) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:118](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L118) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:127](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L127) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:127](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L127) | texto · `button` | — | 2,473:1 · hover · 1366 px · `#ffffff/#00bc7d` | — |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx:131](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L131) | ícone · `GitBranch` | — | 2,473:1 · hover · 1366 px · `#ffffff/#00bc7d` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:17](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L17) | ícone · `User` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:24](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L24) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:36](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L36) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:48](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L48) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:48](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L48) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:63](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L63) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:81](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L81) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:103](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L103) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:119](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L119) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:131](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L131) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:144](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L144) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:148](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L148) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:148](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L148) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx:160](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx#L160) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx:17](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L17) | ícone · `Wifi` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx:24](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L24) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx:44](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L44) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx:64](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L64) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx:86](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L86) | contorno · `select` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:14](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L14) | ícone · `HeartPulse` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:21](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L21) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:42](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L42) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:61](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L61) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:82](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L82) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx:82](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx#L82) | placeholder · `input` | 4,004:1 · normal · 1366 px · `#7f7f7f/#ffffff` | 4,490:1 · normal · 1366 px · `#7e8795/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:17](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L17) | ícone · `Briefcase` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:24](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L24) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:57](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L57) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:78](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L78) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:92](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L92) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:110](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L110) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:131](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L131) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx:145](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx#L145) | contorno · `input` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-turma-aluno.tsx:25](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L25) | contorno · `select` | 1,472:1 · normal · 1366 px · `#d1d5dc/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/campos-turma-aluno.tsx:25](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L25) | foco · `select` | 2,619:1 · foco · 1366 px · `#00a6f4/#f7fcff` | — | — |
| [nexus/diretoria/alunos/_components/campos-turma-aluno.tsx:39](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L39) | texto · `p` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:57](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L57) | ícone · `Users` | 1,181:1 · normal · 1366 px · `#ebecef/#ffffff` | 1,421:1 · normal · 1366 px · `#303a4c/#162033` | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:58](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L58) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:72](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L72) | foco · `input` | 2,680:1 · foco · 1366 px · `#f97316/#f8fafc` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:84](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L84) | texto · `p` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:90](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L90) | ícone · `User` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:93](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L93) | ícone · `Smartphone` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:97](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L97) | ícone · `BookOpen` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:106](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L106) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:114](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L114) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:123](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L123) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:143](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L143) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:152](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L152) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx:44](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx#L44) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx:48](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx#L48) | ícone · `X` | 2,365:1 · hover · 1366 px · `#99a1af/#f3f4f6` | — | — |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx:77](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx#L77) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx:84](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx#L84) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx:84](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx#L84) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:66](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L66) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:73](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L73) | ícone · `X` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:78](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L78) | contorno · `select` | 1,486:1 · normal · 1366 px · `#cad5e2/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:78](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L78) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:99](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L99) | contorno · `input` | 1,486:1 · normal · 1366 px · `#cad5e2/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:99](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L99) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:99](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L99) | placeholder · `input` | 3,052:1 · normal · 1366 px · `#8e949e/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:112](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L112) | texto · `p` | — | 2,300:1 · normal · 1366 px · `#973c00/#162033` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:121](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L121) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:138](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L138) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:138](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L138) | texto · `button` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx:145](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx#L145) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:84](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L84) | ícone · `FileSpreadsheet` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:90](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L90) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:95](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L95) | foco · `button` | 1,435:1 · foco · 1366 px · `#f97316/#0084d1` | 1,435:1 · foco · 1366 px · `#f97316/#0084d1` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:101](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L101) | ícone · `X` | 2,805:1 · hover · 1366 px · `#ffffff/#40a3dd` | 2,805:1 · hover · 1366 px · `#ffffff/#40a3dd` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:113](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L113) | ícone · `Upload` | 2,709:1 · hover · 1366 px · `#ff6900/#f0f9ff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:117](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L117) | texto · `span` | 4,471:1 · hover · 1366 px · `#62748e/#f0f9ff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:120](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L120) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:148](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L148) | placeholder · `input` | 2,539:1 · normal · 1366 px · `#00a6f4/#f0f9ff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:161](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L161) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:186](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L186) | placeholder · `input` | 2,720:1 · normal · 1366 px · `#ff6900/#fff7ed` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:199](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L199) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:210](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L210) | texto · `span` | 4,489:1 · hover · 1366 px · `#62748e/#fff7ed` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:219](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L219) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:219](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L219) | texto · `button` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:224](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L224) | ícone · `Check` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:245](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L245) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:252](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L252) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx:252](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L252) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:46](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L46) | ícone · `Layers3` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:58](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L58) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:64](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L64) | ícone · `X` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:72](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L72) | texto · `h3` | — | 1,348:1 · normal · 1366 px · `#052f4a/#0b1220` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:86](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L86) | texto · `span` | — | 1,025:1 · normal · 1366 px · `#052f4a/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:97](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L97) | texto · `h3` | — | 1,248:1 · normal · 1366 px · `#461901/#0b1220` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:98](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L98) | texto · `span` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:111](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L111) | foco · `input` | 2,703:1 · foco · 1366 px · `#f97316/#fffbeb` | — | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:118](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L118) | texto · `span` | — | 1,054:1 · normal · 1366 px · `#461901/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:121](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L121) | texto · `span` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:142](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L142) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:142](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L142) | texto · `button` | — | 1,198:1 · hover · 1366 px · `#dbe7f5/#f8fafc` | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:149](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L149) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx:149](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L149) | texto · `button` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | — |
| [nexus/diretoria/alunos/_components/vinculos-importacao.tsx:49](../src/app/nexus/diretoria/alunos/_components/vinculos-importacao.tsx#L49) | texto · `p` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/alunos/_components/vinculos-importacao.tsx:50](../src/app/nexus/diretoria/alunos/_components/vinculos-importacao.tsx#L50) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/diretoria/alunos/[id]/page.tsx:79](../src/app/nexus/diretoria/alunos/%5Bid%5D/page.tsx#L79) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/alunos/[id]/page.tsx:79](../src/app/nexus/diretoria/alunos/%5Bid%5D/page.tsx#L79) | texto · `Link` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/alunos/[id]/page.tsx:83](../src/app/nexus/diretoria/alunos/%5Bid%5D/page.tsx#L83) | ícone · `ArrowLeft` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/alunos/[id]/page.tsx:94](../src/app/nexus/diretoria/alunos/%5Bid%5D/page.tsx#L94) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/diretoria/alunos/page.tsx:103](../src/app/nexus/diretoria/alunos/page.tsx#L103) | texto · `p` | — | 1,503:1 · normal · 1366 px · `#024a70/#1e2b40` | — |
| [nexus/diretoria/alunos/page.tsx:106](../src/app/nexus/diretoria/alunos/page.tsx#L106) | texto · `p` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/alunos/page.tsx:115](../src/app/nexus/diretoria/alunos/page.tsx#L115) | contorno · `select` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/alunos/page.tsx:115](../src/app/nexus/diretoria/alunos/page.tsx#L115) | foco · `select` | 1,103:1 · foco · 1366 px · `#dff2fe/#f6fbff` | — | — |
| [nexus/diretoria/conecta/_components/doacoes.tsx:99](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L99) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:109](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L109) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:125](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L125) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:143](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L143) | texto · `small` | 4,344:1 · normal · 1366 px · `#64748b/#f1f5f9` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:148](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L148) | foco · `input` | 2,559:1 · foco · 1366 px · `#f97316/#f1f5f9` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:177](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L177) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:191](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L191) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:227](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L227) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/doacoes.tsx:245](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L245) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:86](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L86) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:102](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L102) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:112](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L112) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:123](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L123) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:132](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L132) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:149](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L149) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:160](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L160) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:195](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L195) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/equipes.tsx:210](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L210) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:83](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L83) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:93](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L93) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:102](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L102) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:114](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L114) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:122](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L122) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:130](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L130) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:159](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L159) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/itens.tsx:173](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L173) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:81](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L81) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:81](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L81) | placeholder · `input` | 3,414:1 · normal · 1366 px · `#878b94/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:92](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L92) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:108](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L108) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:117](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L117) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:133](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L133) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:146](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L146) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:180](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L180) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/_components/provas.tsx:194](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L194) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/conecta/page.tsx:45](../src/app/nexus/diretoria/conecta/page.tsx#L45) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/conecta/page.tsx:59](../src/app/nexus/diretoria/conecta/page.tsx#L59) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:31](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L31) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:35](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L35) | ícone · `ArrowLeft` | 2,365:1 · hover · 1366 px · `#99a1af/#f3f4f6` | — | — |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:58](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L58) | texto · `p` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:72](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L72) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:78](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L78) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx:78](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx#L78) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/diretores/page.tsx:47](../src/app/nexus/diretoria/diretores/page.tsx#L47) | texto · `p` | — | 2,655:1 · normal · 1366 px · `#007a55/#1e2b40` | — |
| [nexus/diretoria/diretores/page.tsx:60](../src/app/nexus/diretoria/diretores/page.tsx#L60) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/diretores/page.tsx:60](../src/app/nexus/diretoria/diretores/page.tsx#L60) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/diretores/page.tsx:79](../src/app/nexus/diretoria/diretores/page.tsx#L79) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/estoque/_components/card-item.tsx:39](../src/app/nexus/diretoria/estoque/_components/card-item.tsx#L39) | foco · `button` | — | 2,538:1 · foco · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/estoque/_components/card-item.tsx:46](../src/app/nexus/diretoria/estoque/_components/card-item.tsx#L46) | ícone · `Trash2` | — | 1,951:1 · normal · 1366 px · `#9f0712/#162033` | — |
| [nexus/diretoria/estoque/_components/card-item.tsx:51](../src/app/nexus/diretoria/estoque/_components/card-item.tsx#L51) | texto · `strong` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:50](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L50) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:50](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L50) | placeholder · `input` | 4,004:1 · normal · 1366 px · `#7f7f7f/#ffffff` | 4,490:1 · normal · 1366 px · `#7e8795/#162033` | Sim |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:59](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L59) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:69](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L69) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:44](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L44) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:44](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L44) | placeholder · `input` | 2,641:1 · normal · 1366 px · `#98a0ab/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | Sim |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:55](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L55) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:64](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L64) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:79](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L79) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:79](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L79) | texto · `button` | — | 1,720:1 · hover · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:41](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L41) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:41](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L41) | placeholder · `input` | 3,052:1 · normal · 1366 px · `#8e949e/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:54](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L54) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:54](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L54) | placeholder · `input` | 3,052:1 · normal · 1366 px · `#8e949e/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:69](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L69) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:91](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L91) | texto · `label` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:95](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L95) | foco · `input` | 1,435:1 · foco · 1366 px · `#f97316/#0084d1` | 1,435:1 · foco · 1366 px · `#f97316/#0084d1` | — |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:121](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L121) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:126](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L126) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:137](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L137) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:137](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L137) | texto · `button` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/estoque/page.tsx:146](../src/app/nexus/diretoria/estoque/page.tsx#L146) | texto · `span` | 1,149:1 · normal · 1366 px · `#dff2fe/#ffffff` | — | — |
| [nexus/diretoria/estoque/page.tsx:149](../src/app/nexus/diretoria/estoque/page.tsx#L149) | texto · `strong` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | — |
| [nexus/diretoria/estoque/page.tsx:165](../src/app/nexus/diretoria/estoque/page.tsx#L165) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/estoque/page.tsx:222](../src/app/nexus/diretoria/estoque/page.tsx#L222) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/estoque/page.tsx:232](../src/app/nexus/diretoria/estoque/page.tsx#L232) | foco · `button` | 2,563:1 · foco · 1366 px · `#f97316/#fef2f2` | 2,563:1 · foco · 1366 px · `#f97316/#fef2f2` | — |
| [nexus/diretoria/formularios/_components/cabecalho-formulario.tsx:35](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L35) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/formularios/_components/cabecalho-formulario.tsx:35](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L35) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/formularios/_components/cabecalho-formulario.tsx:42](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L42) | contorno · `textarea` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/formularios/_components/cabecalho-formulario.tsx:42](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L42) | placeholder · `textarea` | 2,308:1 · normal · 1366 px · `#a1a8b0/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:48](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L48) | contorno · `input` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:48](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L48) | foco · `input` | 2,691:1 · foco · 1366 px · `#f97316/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:63](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L63) | contorno · `select` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:63](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L63) | foco · `select` | 2,691:1 · foco · 1366 px · `#f97316/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:82](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L82) | foco · `input` | 2,691:1 · foco · 1366 px · `#f97316/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:96](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L96) | foco · `input` | 2,691:1 · foco · 1366 px · `#f97316/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:110](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L110) | foco · `input` | 2,691:1 · foco · 1366 px · `#f97316/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:127](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L127) | contorno · `select` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:127](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L127) | foco · `select` | 1,103:1 · foco · 1366 px · `#dff2fe/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:148](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L148) | contorno · `select` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx:148](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L148) | foco · `select` | 1,103:1 · foco · 1366 px · `#dff2fe/#f6fbff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:45](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L45) | ícone · `GripVertical` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:53](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L53) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:53](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L53) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:64](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L64) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:78](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L78) | ícone · `svg` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:98](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L98) | texto · `input` | — | 1,199:1 · foco · 1366 px · `#dbe7f5/#f9fafb` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:107](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L107) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:107](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L107) | texto · `button` | — | 1,198:1 · hover · 1366 px · `#dbe7f5/#f8fafc` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:142](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L142) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:150](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L150) | ícone · `X` | 2,602:1 · normal · 390 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:159](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L159) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:159](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L159) | texto · `button` | 4,022:1 · normal · 1366 px · `#0084d1/#ffffff` | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:170](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L170) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:175](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L175) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:183](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L183) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:183](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L183) | texto · `button` | 4,397:1 · hover · 1366 px · `#6a7282/#f3f4f6` | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:198](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L198) | ícone · `Check` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:203](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L203) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:208](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L208) | ícone · `Copy` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 1,496:1 · hover · 1366 px · `#4a5565/#2b3b54` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:210](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L210) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:215](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L215) | ícone · `Trash2` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:227](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L227) | texto · `span` | 3,807:1 · normal · 1366 px · `#fb2c36/#ffffff` | 4,281:1 · normal · 1366 px · `#fb2c36/#162033` | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:244](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L244) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx:249](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L249) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/formularios/page.tsx:114](../src/app/nexus/diretoria/formularios/page.tsx#L114) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/page.tsx:114](../src/app/nexus/diretoria/formularios/page.tsx#L114) | texto · `button` | 4,022:1 · hover · 1366 px · `#0084d1/#ffffff` | — | — |
| [nexus/diretoria/formularios/page.tsx:130](../src/app/nexus/diretoria/formularios/page.tsx#L130) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/formularios/page.tsx:130](../src/app/nexus/diretoria/formularios/page.tsx#L130) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/formularios/page.tsx:156](../src/app/nexus/diretoria/formularios/page.tsx#L156) | texto · `p` | — | 1,996:1 · normal · 1366 px · `#016630/#1e2b40` | — |
| [nexus/diretoria/formularios/page.tsx:162](../src/app/nexus/diretoria/formularios/page.tsx#L162) | texto · `a` | — | 1,996:1 · normal · 1366 px · `#016630/#1e2b40` | — |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx:48](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx#L48) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx:68](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx#L68) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx:77](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx#L77) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx:90](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx#L90) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx:101](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx#L101) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/campo.tsx:17](../src/app/nexus/diretoria/impressao/_components/campo.tsx#L17) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:41](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L41) | ícone · `FileText` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/impressao/_components/editor.tsx:42](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L42) | texto · `h2` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/impressao/_components/editor.tsx:89](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L89) | texto · `legend` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/impressao/_components/editor.tsx:90](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L90) | ícone · `Users` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/impressao/_components/editor.tsx:99](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L99) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:125](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L125) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:133](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L133) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:141](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L141) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:152](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L152) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:159](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L159) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/editor.tsx:159](../src/app/nexus/diretoria/impressao/_components/editor.tsx#L159) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx:47](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx#L47) | texto · `h2` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | — |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx:48](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx#L48) | texto · `p` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | 4,095:1 · normal · 1366 px · `#ffffff/#0284c7` | — |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx:57](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx#L57) | foco · `input` | 2,117:1 · foco · 1366 px · `#f97316/#0369a1` | 2,117:1 · foco · 1366 px · `#f97316/#0369a1` | — |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx:158](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx#L158) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx:168](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx#L168) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/_components/status-button.tsx:20](../src/app/nexus/diretoria/impressao/_components/status-button.tsx#L20) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/page.tsx:57](../src/app/nexus/diretoria/impressao/page.tsx#L57) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/page.tsx:101](../src/app/nexus/diretoria/impressao/page.tsx#L101) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/impressao/page.tsx:141](../src/app/nexus/diretoria/impressao/page.tsx#L141) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx:48](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx#L48) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx:65](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx#L65) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx:77](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx#L77) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx:94](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx#L94) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx:101](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx#L101) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx:84](../src/app/nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx#L84) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx:92](../src/app/nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx#L92) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:43](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L43) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:56](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L56) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:63](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L63) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:76](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L76) | contorno · `select` | 1,178:1 · normal · 1366 px · `#e2e8f0/#f8fafc` | 2,258:1 · normal · 1366 px · `#42546d/#101a2b` | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:76](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L76) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:91](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L91) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/materiais-atualizacao/page.tsx:118](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx#L118) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:33](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L33) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:40](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L40) | foco · `button` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:53](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L53) | foco · `button` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:62](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L62) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:62](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L62) | texto · `button` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:71](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L71) | ícone · `Loader2` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:73](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L73) | ícone · `FileText` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:77](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L77) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx:77](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L77) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:26](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L26) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:32](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L32) | ícone · `ArrowLeft` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 1,496:1 · hover · 1366 px · `#4a5565/#2b3b54` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:48](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L48) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:48](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L48) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:66](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L66) | ícone · `IdCard` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:67](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L67) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:67](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L67) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:88](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L88) | ícone · `Mail` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:89](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L89) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:89](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L89) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:107](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L107) | texto · `p` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:125](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L125) | ícone · `DoorOpen` | — | 2,655:1 · normal · 1366 px · `#007a55/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:126](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L126) | texto · `span` | — | 2,655:1 · normal · 1366 px · `#007a55/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:131](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L131) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:135](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L135) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:136](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L136) | ícone · `Info` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:143](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L143) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:143](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L143) | texto · `button` | 3,905:1 · hover · 1366 px · `#6a7282/#e5e7eb` | 1,012:1 · hover · 1366 px · `#dbe7f5/#e5e7eb` | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:150](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L150) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx:150](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L150) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:32](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L32) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:39](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L39) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:48](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L48) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:54](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L54) | ícone · `Pencil` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 1,496:1 · hover · 1366 px · `#4a5565/#2b3b54` | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:56](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L56) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:71](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L71) | texto · `span` | — | 2,655:1 · normal · 1366 px · `#007a55/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:75](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L75) | ícone · `DoorOpen` | — | 2,655:1 · normal · 1366 px · `#007a55/#1e2b40` | — |
| [nexus/diretoria/monitores/_components/monitor-card.tsx:81](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L81) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/monitores/page.tsx:110](../src/app/nexus/diretoria/monitores/page.tsx#L110) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/page.tsx:27](../src/app/nexus/diretoria/page.tsx#L27) | ícone · `Building2` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/diretoria/page.tsx:32](../src/app/nexus/diretoria/page.tsx#L32) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/diretoria/presencas/_components/historico-presencas.tsx:40](../src/app/nexus/diretoria/presencas/_components/historico-presencas.tsx#L40) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/_components/historico-presencas.tsx:51](../src/app/nexus/diretoria/presencas/_components/historico-presencas.tsx#L51) | ícone · `Trash2` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/presencas/_components/historico-presencas.tsx:56](../src/app/nexus/diretoria/presencas/_components/historico-presencas.tsx#L56) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/presencas/_components/planilhas-presencas.tsx:138](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx#L138) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:65](../src/app/nexus/diretoria/presencas/page.tsx#L65) | contorno · `select` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/presencas/page.tsx:65](../src/app/nexus/diretoria/presencas/page.tsx#L65) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:83](../src/app/nexus/diretoria/presencas/page.tsx#L83) | contorno · `select` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/presencas/page.tsx:83](../src/app/nexus/diretoria/presencas/page.tsx#L83) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:112](../src/app/nexus/diretoria/presencas/page.tsx#L112) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/presencas/page.tsx:112](../src/app/nexus/diretoria/presencas/page.tsx#L112) | texto · `button` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/presencas/page.tsx:118](../src/app/nexus/diretoria/presencas/page.tsx#L118) | ícone · `Check` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/presencas/page.tsx:128](../src/app/nexus/diretoria/presencas/page.tsx#L128) | texto · `p` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/presencas/page.tsx:133](../src/app/nexus/diretoria/presencas/page.tsx#L133) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:133](../src/app/nexus/diretoria/presencas/page.tsx#L133) | texto · `button` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/presencas/page.tsx:139](../src/app/nexus/diretoria/presencas/page.tsx#L139) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:139](../src/app/nexus/diretoria/presencas/page.tsx#L139) | texto · `button` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/presencas/page.tsx:145](../src/app/nexus/diretoria/presencas/page.tsx#L145) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/presencas/page.tsx:145](../src/app/nexus/diretoria/presencas/page.tsx#L145) | texto · `button` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:25](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L25) | foco · `button` | 2,887:1 · foco · 1366 px · `#ff6900/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:25](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L25) | texto · `button` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:33](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L33) | ícone · `Loader2` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:35](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L35) | ícone · `FileText` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:39](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L39) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/acoes-professores.tsx:39](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx#L39) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:26](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L26) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:31](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L31) | ícone · `ArrowLeft` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 1,496:1 · hover · 1366 px · `#4a5565/#2b3b54` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:44](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L44) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:44](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L44) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:58](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L58) | ícone · `IdCard` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:59](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L59) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:59](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L59) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:76](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L76) | ícone · `Mail` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:77](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L77) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:77](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L77) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:94](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L94) | texto · `p` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:112](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L112) | ícone · `DoorOpen` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:113](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L113) | texto · `span` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:118](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L118) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:122](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L122) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:123](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L123) | ícone · `Info` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:130](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L130) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:130](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L130) | texto · `button` | 3,905:1 · hover · 1366 px · `#6a7282/#e5e7eb` | 1,012:1 · hover · 1366 px · `#dbe7f5/#e5e7eb` | — |
| [nexus/diretoria/professores/_components/formulario-professor.tsx:136](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L136) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:21](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L21) | texto · `div` | 2,321:1 · normal · 1366 px · `#00a6f4/#ffebcc` | 4,174:1 · normal · 1366 px · `#00a6f4/#453929` | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:32](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L32) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:39](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L39) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:45](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L45) | ícone · `FileText` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:47](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L47) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:52](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L52) | ícone · `Pencil` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | 1,496:1 · hover · 1366 px · `#4a5565/#2b3b54` | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:54](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L54) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:59](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L59) | ícone · `Trash2` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:68](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L68) | texto · `span` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:72](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L72) | ícone · `DoorOpen` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/professores/_components/professor-card.tsx:78](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L78) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/professores/page.tsx:104](../src/app/nexus/diretoria/professores/page.tsx#L104) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:35](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L35) | texto · `h2` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:47](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L47) | texto · `p` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:58](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L58) | texto · `p` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:75](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L75) | ícone · `BarChart3` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:86](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L86) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:95](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L95) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:113](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L113) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:119](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L119) | ícone · `BarChart3` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:121](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L121) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx:129](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L129) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx:41](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L41) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx:47](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L47) | ícone · `X` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx:59](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L59) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx:59](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L59) | texto · `button` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx:66](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L66) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx:40](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L40) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx:46](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L46) | ícone · `X` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx:57](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L57) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx:65](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L65) | texto · `a` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/questionarios/[id]/_components/analytics-question.tsx:49](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/analytics-question.tsx#L49) | texto · `span` | — | 1,996:1 · normal · 1366 px · `#016630/#1e2b40` | — |
| [nexus/diretoria/questionarios/[id]/_components/analytics-question.tsx:50](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/analytics-question.tsx#L50) | ícone · `CheckCircle2` | — | 1,996:1 · normal · 1366 px · `#016630/#1e2b40` | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:25](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L25) | ícone · `UserRound` | — | 1,862:1 · normal · 1366 px · `#024a70/#10182c` | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:31](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L31) | ícone · `Search` | 2,524:1 · normal · 1366 px · `#90a1b9/#f6fbff` | — | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:35](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L35) | contorno · `input` | 1,149:1 · normal · 1366 px · `#dff2fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:35](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L35) | foco · `input` | 1,219:1 · foco · 1366 px · `#c5eafd/#f6fbff` | 1,379:1 · foco · 1366 px · `#0d3454/#10182c` | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:35](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L35) | placeholder · `input` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx:70](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L70) | texto · `span` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:57](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L57) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:57](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L57) | texto · `Link` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:64](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L64) | ícone · `BarChart3` | 2,360:1 · normal · 1366 px · `#ffb86a/#0084d1` | 2,360:1 · normal · 1366 px · `#ffb86a/#0084d1` | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:68](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L68) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:77](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L77) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:77](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L77) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:86](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L86) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/[id]/page.tsx:86](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L86) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/questionarios/page.tsx:29](../src/app/nexus/diretoria/questionarios/page.tsx#L29) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/page.tsx:29](../src/app/nexus/diretoria/questionarios/page.tsx#L29) | texto · `Link` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/questionarios/page.tsx:40](../src/app/nexus/diretoria/questionarios/page.tsx#L40) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/questionarios/page.tsx:50](../src/app/nexus/diretoria/questionarios/page.tsx#L50) | ícone · `Search` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/diretoria/questionarios/page.tsx:54](../src/app/nexus/diretoria/questionarios/page.tsx#L54) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/questionarios/page.tsx:54](../src/app/nexus/diretoria/questionarios/page.tsx#L54) | foco · `input` | 1,228:1 · foco · 1366 px · `#ccedfd/#ffffff` | 1,388:1 · foco · 1366 px · `#123b5a/#162033` | — |
| [nexus/diretoria/questionarios/page.tsx:54](../src/app/nexus/diretoria/questionarios/page.tsx#L54) | placeholder · `input` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:47](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L47) | texto · `p` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:49](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L49) | texto · `span` | 3,555:1 · normal · 1366 px · `#e6f3fa/#0084d1` | 3,555:1 · normal · 1366 px · `#e6f3fa/#0084d1` | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:55](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L55) | ícone · `CalendarDays` | 2,910:1 · normal · 1366 px · `#bfe0f3/#0084d1` | 2,910:1 · normal · 1366 px · `#bfe0f3/#0084d1` | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:76](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L76) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:83](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L83) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:83](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L83) | texto · `button` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:94](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L94) | ícone · `Copy` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx:96](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L96) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/semestres/_components/resumo.tsx:18](../src/app/nexus/diretoria/semestres/_components/resumo.tsx#L18) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/semestres/page.tsx:46](../src/app/nexus/diretoria/semestres/page.tsx#L46) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/semestres/page.tsx:46](../src/app/nexus/diretoria/semestres/page.tsx#L46) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/semestres/page.tsx:54](../src/app/nexus/diretoria/semestres/page.tsx#L54) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/semestres/page.tsx:54](../src/app/nexus/diretoria/semestres/page.tsx#L54) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/semestres/page.tsx:64](../src/app/nexus/diretoria/semestres/page.tsx#L64) | texto · `p` | — | 3,416:1 · normal · 1366 px · `#e7000b/#162033` | — |
| [nexus/diretoria/semestres/page.tsx:102](../src/app/nexus/diretoria/semestres/page.tsx#L102) | contorno · `input` | 1,486:1 · normal · 1366 px · `#cad5e2/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/semestres/page.tsx:102](../src/app/nexus/diretoria/semestres/page.tsx#L102) | foco · `input` | 1,147:1 · foco · 1366 px · `#ffedd4/#ffffff` | — | — |
| [nexus/diretoria/semestres/page.tsx:102](../src/app/nexus/diretoria/semestres/page.tsx#L102) | placeholder · `input` | 3,052:1 · normal · 1366 px · `#8e949e/#ffffff` | 4,299:1 · normal · 1366 px · `#798494/#162033` | — |
| [nexus/diretoria/semestres/page.tsx:114](../src/app/nexus/diretoria/semestres/page.tsx#L114) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/semestres/page.tsx:114](../src/app/nexus/diretoria/semestres/page.tsx#L114) | texto · `button` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/semestres/page.tsx:121](../src/app/nexus/diretoria/semestres/page.tsx#L121) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:23](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L23) | texto · `span` | 2,477:1 · normal · 1366 px · `#d6935e/#fffbeb` | 1,677:1 · normal · 1366 px · `#0c507e/#1e2b40` | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:26](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L26) | texto · `span` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:49](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L49) | foco · `button` | 2,803:1 · foco · 390 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:54](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L54) | ícone · `Pencil` | — | 1,154:1 · normal · 390 px · `#0c121c/#162033` | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:56](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L56) | foco · `button` | 2,803:1 · foco · 390 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx:61](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L61) | ícone · `Trash2` | — | 1,154:1 · normal · 390 px · `#0c121c/#162033` | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:27](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L27) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:27](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L27) | foco · `select` | 1,149:1 · foco · 1366 px · `#dff2fe/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:41](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L41) | ícone · `Search` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:42](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L42) | placeholder · `input` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:50](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L50) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx:50](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx#L50) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:36](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L36) | texto · `span` | 4,022:1 · normal · 1366 px · `#0084d1/#ffffff` | 4,052:1 · normal · 1366 px · `#0084d1/#162033` | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:45](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L45) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:66](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L66) | ícone · `Monitor` | 2,873:1 · normal · 1366 px · `#e17100/#fef3c6` | — | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:68](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L68) | texto · `h2` | — | 2,637:1 · normal · 1366 px · `#dbe7f5/#8b8e8e` | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:70](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L70) | texto · `span` | 3,200:1 · normal · 1366 px · `#e17100/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx:79](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L79) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:53](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L53) | foco · `button` | 2,734:1 · foco · 1366 px · `#f97316/#fcfcfd` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:57](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L57) | ícone · `X` | 2,538:1 · normal · 1366 px · `#99a1af/#fcfcfd` | 1,098:1 · hover · 1366 px · `#364153/#2b3b54` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:72](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L72) | ícone · `FileDigit` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:74](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L74) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:74](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L74) | foco · `input` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:74](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L74) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:87](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L87) | ícone · `Ticket` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:90](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L90) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:90](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L90) | texto · `button` | — | 1,195:1 · normal · 1366 px · `#090d14/#162033` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:95](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L95) | ícone · `Smartphone` | — | 1,195:1 · normal · 1366 px · `#090d14/#162033` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:97](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L97) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:97](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L97) | texto · `button` | — | 1,195:1 · normal · 1366 px · `#090d14/#162033` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:102](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L102) | ícone · `Monitor` | — | 1,195:1 · normal · 1366 px · `#090d14/#162033` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:110](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L110) | ícone · `User` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:112](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L112) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:112](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L112) | foco · `input` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:112](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L112) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:125](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L125) | ícone · `Calendar` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:127](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L127) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:127](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L127) | foco · `input` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:141](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L141) | ícone · `FileDigit` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:143](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L143) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:143](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L143) | foco · `input` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:143](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L143) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:159](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L159) | ícone · `Phone` | 2,706:1 · normal · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:161](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L161) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:161](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L161) | foco · `input` | 2,706:1 · foco · 1366 px · `#00a6f4/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:161](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L161) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:180](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L180) | ícone · `PhoneCall` | 2,889:1 · normal · 1366 px · `#ff6467/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:183](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L183) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:183](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L183) | foco · `input` | 2,889:1 · foco · 1366 px · `#ff6467/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:183](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L183) | placeholder · `input` | 3,383:1 · normal · 1366 px · `#848991/#f9fafb` | 4,493:1 · normal · 1366 px · `#737d8b/#0b1220` | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:198](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L198) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:205](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L205) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx:205](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L205) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/sorteio/page.tsx:49](../src/app/nexus/diretoria/sorteio/page.tsx#L49) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/page.tsx:62](../src/app/nexus/diretoria/sorteio/page.tsx#L62) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/page.tsx:71](../src/app/nexus/diretoria/sorteio/page.tsx#L71) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:30](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L30) | texto · `span` | 3,581:1 · normal · 1366 px · `#ffffff/#f54a00` | 3,581:1 · normal · 1366 px · `#ffffff/#f54a00` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:44](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L44) | texto · `span` | 3,774:1 · normal · 1366 px · `#0084d1/#f0f9ff` | 3,540:1 · normal · 1366 px · `#0084d1/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:61](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L61) | texto · `div` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 1,289:1 · normal · 1366 px · `#000000/#162033` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:67](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L67) | texto · `span` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:73](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L73) | texto · `span` | 2,490:1 · normal · 1366 px · `#99a1af/#f9fafb` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:83](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L83) | texto · `div` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:96](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L96) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:109](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L109) | texto · `span` | 3,774:1 · normal · 1366 px · `#0084d1/#f0f9ff` | 3,540:1 · normal · 1366 px · `#0084d1/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:126](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L126) | texto · `div` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 1,475:1 · normal · 1366 px · `#000000/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:132](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L132) | texto · `span` | — | 2,009:1 · normal · 1366 px · `#973c00/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:138](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L138) | texto · `span` | 2,509:1 · normal · 1366 px · `#99a1af/#fffbeb` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:148](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L148) | texto · `div` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx:161](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L161) | texto · `span` | 2,538:1 · normal · 1366 px · `#99a1af/#fcfcfd` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:82](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L82) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:98](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L98) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:98](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L98) | foco · `select` | 1,149:1 · foco · 1366 px · `#dff2fe/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:119](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L119) | foco · `button` | 2,548:1 · foco · 1366 px · `#f97316/#f3f4f6` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:129](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L129) | ícone · `Users` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:130](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L130) | texto · `span` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:132](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L132) | foco · `button` | 2,548:1 · foco · 1366 px · `#f97316/#f3f4f6` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:142](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L142) | ícone · `Hash` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:143](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L143) | texto · `span` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:154](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L154) | foco · `button` | 2,548:1 · foco · 1366 px · `#f97316/#f3f4f6` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:163](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L163) | ícone · `Smartphone` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:164](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L164) | texto · `span` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:166](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L166) | foco · `button` | 2,548:1 · foco · 1366 px · `#f97316/#f3f4f6` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:175](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L175) | ícone · `Monitor` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:176](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L176) | texto · `span` | 2,365:1 · normal · 1366 px · `#99a1af/#f3f4f6` | 1,884:1 · hover · 1366 px · `#4a5565/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:190](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L190) | texto · `p` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:194](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L194) | texto · `a` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:213](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L213) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:213](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L213) | texto · `input` | — | 3,198:1 · normal · 1366 px · `#0069a8/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:228](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L228) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:228](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L228) | texto · `input` | — | 3,198:1 · normal · 1366 px · `#0069a8/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:240](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L240) | foco · `button` | 1,273:1 · foco · 1366 px · `#b8e6fe/#f9fafb` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:253](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L253) | texto · `span` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:262](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L262) | ícone · `ChevronDown` | — | 2,812:1 · hover · 1366 px · `#0084d1/#2b3b54` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:281](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L281) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:281](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L281) | texto · `button` | 3,850:1 · normal · 1366 px · `#0084d1/#f9fafb` | 3,198:1 · hover · 1366 px · `#0069a8/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:290](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L290) | contorno · `input` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:290](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L290) | foco · `input` | 1,100:1 · foco · 1366 px · `#dff2fe/#f9fafb` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:290](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L290) | placeholder · `input` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:300](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L300) | texto · `p` | — | 3,924:1 · normal · 1366 px · `#e7000b/#0b1220` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:324](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L324) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:324](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L324) | texto · `button` | 3,581:1 · normal · 1366 px · `#ffffff/#f54a00` | 3,581:1 · normal · 1366 px · `#ffffff/#f54a00` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:335](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L335) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:348](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L348) | ícone · `Download` | — | 2,812:1 · hover · 1366 px · `#0084d1/#2b3b54` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:349](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L349) | texto · `span` | 3,774:1 · hover · 1366 px · `#0084d1/#f0f9ff` | 2,812:1 · hover · 1366 px · `#0084d1/#2b3b54` | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:351](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L351) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx:357](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L357) | ícone · `Trash2` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:18](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L18) | ícone · `Loader2` | 1,935:1 · normal · 1366 px · `#7bc0e8/#f7fcff` | 1,870:1 · normal · 1366 px · `#0f5789/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:20](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L20) | texto · `span` | 3,893:1 · normal · 1366 px · `#0084d1/#f7fcff` | 3,540:1 · normal · 1366 px · `#0084d1/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:23](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L23) | texto · `span` | 2,222:1 · normal · 1366 px · `#63b4e3/#f7fcff` | 2,129:1 · normal · 1366 px · `#0c6097/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:37](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L37) | ícone · `UserCircle2` | — | 2,831:1 · normal · 1366 px · `#bb4d00/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:38](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L38) | texto · `span` | — | 2,831:1 · normal · 1366 px · `#bb4d00/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:43](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L43) | texto · `div` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | 2,135:1 · normal · 1366 px · `#ffffff/#fe9a00` | — |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx:51](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L51) | texto · `span` | 1,282:1 · normal · 1366 px · `#dbe0e6/#f7fcff` | 1,759:1 · normal · 1366 px · `#445164/#1e2b40` | — |
| [nexus/diretoria/sorteio/sorteador/page.tsx:84](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx#L84) | texto · `p` | 3,330:1 · normal · 1366 px · `#d9edf8/#0084d1` | 3,330:1 · normal · 1366 px · `#d9edf8/#0084d1` | — |
| [nexus/diretoria/sorteio/sorteador/page.tsx:133](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx#L133) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/sorteio/sorteador/page.tsx:136](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx#L136) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx:79](../src/app/nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx#L79) | contorno · `input` | 1,486:1 · normal · 1366 px · `#cad5e2/#ffffff` | 1,722:1 · normal · 1366 px · `#314158/#0f172b` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:57](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L57) | texto · `span` | 3,774:1 · normal · 1366 px · `#0084d1/#f0f9ff` | 3,540:1 · normal · 1366 px · `#0084d1/#1e2b40` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:63](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L63) | texto · `span` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:68](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L68) | contorno · `input` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:68](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L68) | texto · `input` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:75](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L75) | contorno · `input` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:81](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L81) | contorno · `select` | 1,360:1 · normal · 1366 px · `#ffd6a8/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:81](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L81) | texto · `select` | — | 2,212:1 · normal · 1366 px · `#9f2d00/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:89](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L89) | texto · `option` | — | 2,212:1 · normal · 1366 px · `#9f2d00/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:90](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L90) | texto · `option` | — | 2,212:1 · normal · 1366 px · `#9f2d00/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:91](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L91) | texto · `option` | — | 2,212:1 · normal · 1366 px · `#9f2d00/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:92](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L92) | texto · `option` | — | 2,212:1 · normal · 1366 px · `#9f2d00/#162033` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:94](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L94) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:99](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L99) | ícone · `Trash2` | — | 2,916:1 · normal · 1366 px · `#c10007/#0b1220` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:105](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L105) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:110](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L110) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:116](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L116) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:126](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L126) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:126](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L126) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx:133](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L133) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:63](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L63) | texto · `a` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:125](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L125) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:155](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L155) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:172](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L172) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:39](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L39) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:60](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L60) | texto · `p` | 2,490:1 · normal · 1366 px · `#99a1af/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:65](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L65) | foco · `button` | 2,683:1 · foco · 1366 px · `#f97316/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:70](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L70) | ícone · `Trash2` | — | 2,916:1 · normal · 1366 px · `#c10007/#0b1220` | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:76](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L76) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:83](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L83) | contorno · `select` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:93](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L93) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:93](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L93) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:99](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L99) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:99](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L99) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx:106](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx#L106) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx:40](../src/app/nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx#L40) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx:45](../src/app/nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx#L45) | ícone · `X` | — | 1,144:1 · hover · 1366 px · `#dbe7f5/#f1f5f9` | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:83](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L83) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/search-select.tsx:96](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L96) | texto · `span` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:104](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L104) | ícone · `Search` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:105](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L105) | contorno · `input` | 1,185:1 · normal · 1366 px · `#e5e7eb/#f9fafb` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:105](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L105) | placeholder · `input` | 3,970:1 · normal · 1366 px · `#7c7d7d/#f9fafb` | — | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:122](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L122) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:127](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L127) | texto · `span` | — | 1,720:1 · normal · 1366 px · `#024a70/#162033` | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:129](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L129) | texto · `span` | 4,471:1 · hover · 1366 px · `#62748e/#f0f9ff` | — | — |
| [nexus/diretoria/turmas/_components/search-select.tsx:136](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L136) | texto · `p` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/turma-card.tsx:62](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L62) | texto · `span` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:70](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L70) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:76](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L76) | ícone · `Pencil` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:78](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L78) | foco · `button` | 1,000:1 · foco · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:85](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L85) | ícone · `Copy` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:87](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L87) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:92](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L92) | ícone · `Trash2` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:108](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L108) | texto · `span` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:115](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L115) | texto · `span` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:123](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L123) | texto · `span` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:133](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L133) | texto · `button` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | Sim |
| [nexus/diretoria/turmas/_components/turma-card.tsx:138](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L138) | ícone · `ClipboardCheck` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | Sim |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:115](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L115) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:115](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L115) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:130](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L130) | contorno · `select` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:130](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L130) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:147](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L147) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:147](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L147) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:147](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L147) | placeholder · `input` | 4,004:1 · normal · 1366 px · `#7f7f7f/#ffffff` | 4,490:1 · normal · 1366 px · `#7e8795/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:158](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L158) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:158](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L158) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:158](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L158) | placeholder · `input` | 4,004:1 · normal · 1366 px · `#7f7f7f/#ffffff` | 4,490:1 · normal · 1366 px · `#7e8795/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:169](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L169) | contorno · `select` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:169](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L169) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:201](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L201) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | 1,858:1 · foco · 1366 px · `#f97316/#d0d2d6` | Sim |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:211](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L211) | texto · `span` | — | 1,279:1 · normal · 1366 px · `#e5edf8/#d0d2d6` | Sim |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:217](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L217) | texto · `span` | — | 1,279:1 · normal · 1366 px · `#e5edf8/#d0d2d6` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:36](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L36) | ícone · `DoorOpen` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:48](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L48) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:51](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L51) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:54](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L54) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:59](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L59) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:63](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L63) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:87](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L87) | texto · `p` | — | 3,425:1 · normal · 1366 px · `#64748b/#162033` | Sim |
| [nexus/diretoria/turmas/controle/page.tsx:26](../src/app/nexus/diretoria/turmas/controle/page.tsx#L26) | foco · `Link` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/controle/page.tsx:26](../src/app/nexus/diretoria/turmas/controle/page.tsx#L26) | texto · `Link` | — | 2,747:1 · normal · 1366 px · `#0369a1/#162033` | — |
| [nexus/diretoria/turmas/controle/page.tsx:27](../src/app/nexus/diretoria/turmas/controle/page.tsx#L27) | ícone · `ArrowLeft` | — | 2,747:1 · normal · 1366 px · `#0369a1/#162033` | — |
| [nexus/diretoria/turmas/controle/page.tsx:35](../src/app/nexus/diretoria/turmas/controle/page.tsx#L35) | texto · `button` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/turmas/controle/page.tsx:43](../src/app/nexus/diretoria/turmas/controle/page.tsx#L43) | ícone · `Download` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/turmas/controle/page.tsx:51](../src/app/nexus/diretoria/turmas/controle/page.tsx#L51) | contorno · `select` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/controle/page.tsx:51](../src/app/nexus/diretoria/turmas/controle/page.tsx#L51) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/controle/page.tsx:74](../src/app/nexus/diretoria/turmas/controle/page.tsx#L74) | texto · `p` | — | 2,538:1 · normal · 1366 px · `#c10007/#162033` | — |
| [nexus/diretoria/turmas/controle/page.tsx:81](../src/app/nexus/diretoria/turmas/controle/page.tsx#L81) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/controle/page.tsx:81](../src/app/nexus/diretoria/turmas/controle/page.tsx#L81) | texto · `button` | — | 2,784:1 · normal · 1366 px · `#0069a8/#162033` | — |
| [nexus/diretoria/turmas/page.tsx:68](../src/app/nexus/diretoria/turmas/page.tsx#L68) | texto · `Link` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/turmas/page.tsx:72](../src/app/nexus/diretoria/turmas/page.tsx#L72) | ícone · `ClipboardCheck` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/diretoria/turmas/page.tsx:90](../src/app/nexus/diretoria/turmas/page.tsx#L90) | contorno · `select` | 1,238:1 · normal · 1366 px · `#e5e7eb/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/diretoria/turmas/page.tsx:90](../src/app/nexus/diretoria/turmas/page.tsx#L90) | foco · `select` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/page.tsx:107](../src/app/nexus/diretoria/turmas/page.tsx#L107) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [nexus/diretoria/turmas/page.tsx:107](../src/app/nexus/diretoria/turmas/page.tsx#L107) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/diretoria/turmas/page.tsx:131](../src/app/nexus/diretoria/turmas/page.tsx#L131) | foco · `button` | 2,563:1 · foco · 1366 px · `#f97316/#fef2f2` | 2,563:1 · foco · 1366 px · `#f97316/#fef2f2` | — |
| [nexus/diretoria/turmas/page.tsx:158](../src/app/nexus/diretoria/turmas/page.tsx#L158) | texto · `div` | 2,602:1 · normal · 1366 px · `#99a1af/#ffffff` | — | — |
| [nexus/login/_components/apresentacao-login.tsx:30](../src/app/nexus/login/_components/apresentacao-login.tsx#L30) | texto · `span` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | 3,774:1 · normal · 1366 px · `#f0f9ff/#0084d1` | — |
| [nexus/login/_components/apresentacao-login.tsx:36](../src/app/nexus/login/_components/apresentacao-login.tsx#L36) | ícone · `ShieldCheck` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | 2,887:1 · normal · 1366 px · `#ffffff/#ff6900` | — |
| [nexus/login/_components/apresentacao-login.tsx:41](../src/app/nexus/login/_components/apresentacao-login.tsx#L41) | texto · `p` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/login/_components/apresentacao-login.tsx:46](../src/app/nexus/login/_components/apresentacao-login.tsx#L46) | ícone · `UsersRound` | 2,957:1 · normal · 1366 px · `#ffd6a8/#0084d1` | 2,957:1 · normal · 1366 px · `#ffd6a8/#0084d1` | — |
| [nexus/login/_components/apresentacao-login.tsx:50](../src/app/nexus/login/_components/apresentacao-login.tsx#L50) | texto · `span` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | 3,501:1 · normal · 1366 px · `#dff2fe/#0084d1` | — |
| [nexus/login/_components/formulario-login.tsx:47](../src/app/nexus/login/_components/formulario-login.tsx#L47) | contorno · `input` | 1,179:1 · normal · 1366 px · `#e2e8f0/#f8fafc` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/login/_components/formulario-login.tsx:47](../src/app/nexus/login/_components/formulario-login.tsx#L47) | foco · `input` | 1,098:1 · foco · 1366 px · `#dff2fe/#f8fafc` | — | — |
| [nexus/login/_components/formulario-login.tsx:47](../src/app/nexus/login/_components/formulario-login.tsx#L47) | placeholder · `input` | 2,514:1 · normal · 1366 px · `#90a1b9/#f8fafc` | — | — |
| [nexus/login/_components/formulario-login.tsx:67](../src/app/nexus/login/_components/formulario-login.tsx#L67) | contorno · `input` | 1,179:1 · normal · 1366 px · `#e2e8f0/#f8fafc` | 2,426:1 · normal · 1366 px · `#42546d/#0b1220` | — |
| [nexus/login/_components/formulario-login.tsx:67](../src/app/nexus/login/_components/formulario-login.tsx#L67) | foco · `input` | 1,098:1 · foco · 1366 px · `#dff2fe/#f8fafc` | — | — |
| [nexus/login/_components/formulario-login.tsx:67](../src/app/nexus/login/_components/formulario-login.tsx#L67) | placeholder · `input` | 2,514:1 · normal · 1366 px · `#90a1b9/#f8fafc` | — | — |
| [nexus/login/_components/formulario-login.tsx:76](../src/app/nexus/login/_components/formulario-login.tsx#L76) | foco · `button` | 2,587:1 · foco · 1366 px · `#00a6f4/#f8fafc` | — | — |
| [nexus/login/_components/formulario-login.tsx:83](../src/app/nexus/login/_components/formulario-login.tsx#L83) | ícone · `EyeOff` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/login/_components/formulario-login.tsx:85](../src/app/nexus/login/_components/formulario-login.tsx#L85) | ícone · `Eye` | — | 1,932:1 · hover · 1366 px · `#0069a8/#2b3b54` | — |
| [nexus/login/_components/formulario-login.tsx:101](../src/app/nexus/login/_components/formulario-login.tsx#L101) | texto · `span` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:48](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L48) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:48](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L48) | foco · `input` | 1,098:1 · foco · 1366 px · `#dff2fe/#f8fafc` | — | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:76](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L76) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:76](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L76) | foco · `input` | 1,098:1 · foco · 1366 px · `#dff2fe/#f8fafc` | — | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:76](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L76) | placeholder · `input` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:92](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L92) | contorno · `input` | 1,233:1 · normal · 1366 px · `#e2e8f0/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:92](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L92) | foco · `input` | 1,098:1 · foco · 1366 px · `#dff2fe/#f8fafc` | — | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:92](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L92) | placeholder · `input` | 2,630:1 · normal · 1366 px · `#90a1b9/#ffffff` | — | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:108](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L108) | texto · `p` | — | 1,932:1 · normal · 1366 px · `#9f2d00/#1e2b40` | — |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx:115](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx#L115) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [nexus/redefinir-senha/page.tsx:54](../src/app/nexus/redefinir-senha/page.tsx#L54) | texto · `Link` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [not-found.tsx:52](../src/app/not-found.tsx#L52) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [not-found.tsx:52](../src/app/not-found.tsx#L52) | texto · `button` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | 4,022:1 · normal · 1366 px · `#ffffff/#0084d1` | — |
| [not-found.tsx:60](../src/app/not-found.tsx#L60) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [not-found.tsx:74](../src/app/not-found.tsx#L74) | texto · `span` | 2,274:1 · normal · 1366 px · `#a3a8b2/#f9fafb` | — | — |
| [not-found.tsx:78](../src/app/not-found.tsx#L78) | texto · `span` | 1,666:1 · normal · 1366 px · `#bfc5cd/#f9fafb` | 3,327:1 · normal · 1366 px · `#606876/#0b1220` | — |
| [not-found.tsx:79](../src/app/not-found.tsx#L79) | texto · `span` | 1,666:1 · normal · 1366 px · `#bfc5cd/#f9fafb` | 3,327:1 · normal · 1366 px · `#606876/#0b1220` | — |
| [not-found.tsx:80](../src/app/not-found.tsx#L80) | texto · `span` | 1,666:1 · normal · 1366 px · `#bfc5cd/#f9fafb` | 3,327:1 · normal · 1366 px · `#606876/#0b1220` | — |
| [questionarios/[slug]/_components/estado-enviado.tsx:43](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L43) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/estado-enviado.tsx:50](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L50) | ícone · `Pencil` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/estado-enviado.tsx:54](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L54) | ícone · `Plus` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/estado-respondido.tsx:32](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L32) | foco · `button` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/estado-respondido.tsx:32](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L32) | texto · `button` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/estado-respondido.tsx:37](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L37) | ícone · `Pencil` | 1,000:1 · normal · 1366 px · `#ffffff/#ffffff` | — | Sim |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:70](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L70) | texto · `h1` | 1,046:1 · normal · 1366 px · `#ffffff/#f8fafc` | — | Sim |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:72](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L72) | texto · `p` | 1,098:1 · normal · 1366 px · `#dff2fe/#f8fafc` | — | Sim |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:102](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L102) | ícone · `ShieldCheck` | — | 2,432:1 · normal · 1366 px · `#0069a8/#1e2b40` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:104](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L104) | texto · `h2` | — | 1,025:1 · normal · 1366 px · `#052f4a/#1e2b40` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:111](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L111) | texto · `label` | — | 1,025:1 · normal · 1366 px · `#052f4a/#1e2b40` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:117](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L117) | contorno · `input` | 1,330:1 · normal · 1366 px · `#b8e6fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:117](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L117) | foco · `input` | 1,078:1 · foco · 1366 px · `#dff2fe/#f0f9ff` | — | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:117](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L117) | placeholder · `input` | 3,038:1 · normal · 1366 px · `#8297a4/#ffffff` | 1,080:1 · normal · 1366 px · `#0e283e/#162033` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:117](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L117) | texto · `input` | — | 1,173:1 · normal · 1366 px · `#052f4a/#162033` | — |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:143](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L143) | foco · `button` | 2,679:1 · foco · 1366 px · `#f97316/#f8fafc` | — | Sim |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:143](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L143) | texto · `button` | 1,046:1 · normal · 1366 px · `#ffffff/#f8fafc` | — | Sim |
| [questionarios/[slug]/_components/pergunta-campo.tsx:20](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L20) | texto · `span` | 3,581:1 · normal · 1366 px · `#f54a00/#ffffff` | — | — |
| [questionarios/[slug]/_components/pergunta-campo.tsx:23](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L23) | contorno · `textarea` | 1,149:1 · normal · 1366 px · `#dff2fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [questionarios/[slug]/_components/pergunta-campo.tsx:23](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L23) | foco · `textarea` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [questionarios/[slug]/_components/pergunta-campo.tsx:32](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L32) | contorno · `input` | 1,149:1 · normal · 1366 px · `#dff2fe/#ffffff` | 2,111:1 · normal · 1366 px · `#42546d/#162033` | — |
| [questionarios/[slug]/_components/pergunta-campo.tsx:32](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L32) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |
| [questionarios/[slug]/_components/pergunta-campo.tsx:47](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx#L47) | foco · `input` | 2,803:1 · foco · 1366 px · `#f97316/#ffffff` | — | — |

## Cobertura medida por arquivo

| Arquivo | Elementos | Medições | Dependem de fundo ou efeito | Claro | Escuro |
| --- | ---: | ---: | ---: | ---: | ---: |
| [_components/accessibility-preferences.tsx](../src/app/_components/accessibility-preferences.tsx) | 1 | 4 | 0 | 0 | 0 |
| [_components/botaoVoltar.tsx](../src/app/_components/botaoVoltar.tsx) | 3 | 16 | 0 | 1 | 0 |
| [_components/diretoria-workspace.tsx](../src/app/_components/diretoria-workspace.tsx) | 3 | 18 | 18 | 0 | 0 |
| [_components/diretoria/data-skeleton.tsx](../src/app/_components/diretoria/data-skeleton.tsx) | 2 | 8 | 0 | 0 | 0 |
| [_components/diretoria/form-field.tsx](../src/app/_components/diretoria/form-field.tsx) | 2 | 20 | 0 | 2 | 1 |
| [_components/diretoria/page-intro.tsx](../src/app/_components/diretoria/page-intro.tsx) | 5 | 28 | 0 | 3 | 3 |
| [_components/diretoria/people-management-card.tsx](../src/app/_components/diretoria/people-management-card.tsx) | 17 | 112 | 0 | 9 | 5 |
| [_components/diretoria/presence-grid.tsx](../src/app/_components/diretoria/presence-grid.tsx) | 26 | 84 | 0 | 1 | 4 |
| [_components/diretoria/project-code-modal.tsx](../src/app/_components/diretoria/project-code-modal.tsx) | 12 | 92 | 0 | 6 | 5 |
| [_components/diretoria/sincronizar-presencas-modal.tsx](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx) | 5 | 50 | 0 | 0 | 0 |
| [_components/ferramentaCerd.tsx](../src/app/_components/ferramentaCerd.tsx) | 3 | 18 | 0 | 1 | 0 |
| [_components/force-password-change.tsx](../src/app/_components/force-password-change.tsx) | 18 | 116 | 0 | 9 | 6 |
| [_components/home/_components/acesso-nexus.tsx](../src/app/_components/home/_components/acesso-nexus.tsx) | 5 | 15 | 9 | 0 | 0 |
| [_components/home/_components/canais-atendimento.tsx](../src/app/_components/home/_components/canais-atendimento.tsx) | 17 | 43 | 41 | 0 | 0 |
| [_components/home/contatos.tsx](../src/app/_components/home/contatos.tsx) | 3 | 6 | 0 | 1 | 0 |
| [_components/home/galeria.tsx](../src/app/_components/home/galeria.tsx) | 10 | 27 | 25 | 0 | 0 |
| [_components/home/inscricoes.tsx](../src/app/_components/home/inscricoes.tsx) | 24 | 56 | 26 | 3 | 0 |
| [_components/home/navbar.tsx](../src/app/_components/home/navbar.tsx) | 7 | 28 | 26 | 0 | 0 |
| [_components/home/noticias.tsx](../src/app/_components/home/noticias.tsx) | 1 | 2 | 2 | 0 | 0 |
| [_components/home/onde.tsx](../src/app/_components/home/onde.tsx) | 4 | 14 | 2 | 1 | 0 |
| [_components/home/participar.tsx](../src/app/_components/home/participar.tsx) | 5 | 10 | 2 | 0 | 0 |
| [_components/home/pessalGaleria.tsx](../src/app/_components/home/pessalGaleria.tsx) | 2 | 5 | 0 | 0 | 0 |
| [_components/home/pessoal.tsx](../src/app/_components/home/pessoal.tsx) | 1 | 2 | 2 | 0 | 0 |
| [_components/screen-tour.tsx](../src/app/_components/screen-tour.tsx) | 2 | 20 | 0 | 1 | 0 |
| [_components/screen-tour/painel-tour.tsx](../src/app/_components/screen-tour/painel-tour.tsx) | 16 | 122 | 0 | 4 | 1 |
| [_components/sidebar.tsx](../src/app/_components/sidebar.tsx) | 12 | 154 | 0 | 9 | 0 |
| [_components/sidebar/acessibilidade-sidebar.tsx](../src/app/_components/sidebar/acessibilidade-sidebar.tsx) | 10 | 144 | 0 | 5 | 2 |
| [_components/sidebar/collapsible.tsx](../src/app/_components/sidebar/collapsible.tsx) | 1 | 4 | 0 | 0 | 0 |
| [_components/sidebar/navegacao-sidebar.tsx](../src/app/_components/sidebar/navegacao-sidebar.tsx) | 10 | 114 | 0 | 6 | 4 |
| [_components/turmaCard.tsx](../src/app/_components/turmaCard.tsx) | 15 | 102 | 12 | 7 | 8 |
| [layout.tsx](../src/app/layout.tsx) | 1 | 4 | 0 | 0 | 0 |
| [nexus/acessibilidade/_components/painel-contraste.tsx](../src/app/nexus/acessibilidade/_components/painel-contraste.tsx) | 4 | 20 | 0 | 1 | 1 |
| [nexus/acessibilidade/_components/painel-tamanho-texto.tsx](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx) | 9 | 68 | 0 | 3 | 1 |
| [nexus/acessibilidade/_components/painel-tema.tsx](../src/app/nexus/acessibilidade/_components/painel-tema.tsx) | 3 | 12 | 0 | 0 | 1 |
| [nexus/acessibilidade/_components/previa-acessibilidade.tsx](../src/app/nexus/acessibilidade/_components/previa-acessibilidade.tsx) | 5 | 28 | 0 | 1 | 1 |
| [nexus/acessibilidade/_components/theme-option.tsx](../src/app/nexus/acessibilidade/_components/theme-option.tsx) | 2 | 18 | 0 | 1 | 1 |
| [nexus/acessibilidade/page.tsx](../src/app/nexus/acessibilidade/page.tsx) | 3 | 12 | 0 | 0 | 0 |
| [nexus/configuracoes/_components/info-row.tsx](../src/app/nexus/configuracoes/_components/info-row.tsx) | 2 | 8 | 0 | 1 | 0 |
| [nexus/configuracoes/botaoSair.tsx](../src/app/nexus/configuracoes/botaoSair.tsx) | 2 | 20 | 0 | 2 | 1 |
| [nexus/configuracoes/page.tsx](../src/app/nexus/configuracoes/page.tsx) | 11 | 52 | 0 | 3 | 5 |
| [nexus/dashboard/_components/turma-dashboard-card.tsx](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx) | 10 | 60 | 0 | 4 | 3 |
| [nexus/dashboard/page.tsx](../src/app/nexus/dashboard/page.tsx) | 9 | 36 | 6 | 3 | 2 |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx) | 17 | 172 | 0 | 11 | 4 |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx) | 7 | 42 | 0 | 6 | 0 |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx) | 11 | 182 | 0 | 5 | 4 |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx) | 11 | 48 | 0 | 8 | 1 |
| [nexus/dashboard/turmas/[id]/_components/confirmacao-presenca-modal.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx) | 5 | 26 | 2 | 2 | 1 |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx) | 15 | 82 | 0 | 1 | 0 |
| [nexus/dashboard/turmas/[id]/_components/editar-turma-modal.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx) | 31 | 208 | 0 | 20 | 7 |
| [nexus/dashboard/turmas/[id]/_components/inicio-view.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx) | 13 | 116 | 0 | 10 | 7 |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx) | 15 | 124 | 0 | 9 | 3 |
| [nexus/dashboard/turmas/[id]/_components/matriz-presenca-view.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx) | 8 | 40 | 4 | 0 | 2 |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-desktop.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx) | 2 | 10 | 0 | 2 | 1 |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx) | 3 | 16 | 0 | 2 | 1 |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx) | 20 | 132 | 10 | 3 | 0 |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx) | 11 | 44 | 0 | 5 | 0 |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx) | 9 | 64 | 0 | 7 | 1 |
| [nexus/dashboard/turmas/[id]/page.tsx](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx) | 6 | 48 | 0 | 1 | 2 |
| [nexus/diretoria/_components/acesso-rapido.tsx](../src/app/nexus/diretoria/_components/acesso-rapido.tsx) | 2 | 36 | 0 | 2 | 0 |
| [nexus/diretoria/_components/stat-mini.tsx](../src/app/nexus/diretoria/_components/stat-mini.tsx) | 2 | 12 | 0 | 1 | 0 |
| [nexus/diretoria/alunos/_components/acoes-alunos.tsx](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx) | 21 | 142 | 0 | 13 | 6 |
| [nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/campos-dados-pessoais-aluno.tsx) | 44 | 272 | 0 | 14 | 10 |
| [nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx) | 25 | 132 | 0 | 5 | 4 |
| [nexus/diretoria/alunos/_components/campos-saude-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/campos-saude-aluno.tsx) | 16 | 104 | 0 | 6 | 5 |
| [nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/campos-trabalho-estudo-aluno.tsx) | 31 | 180 | 0 | 8 | 7 |
| [nexus/diretoria/alunos/_components/campos-turma-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx) | 6 | 36 | 0 | 2 | 2 |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx) | 24 | 168 | 0 | 11 | 2 |
| [nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/modal-cadastro-aluno.tsx) | 7 | 50 | 0 | 5 | 1 |
| [nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx](../src/app/nexus/diretoria/alunos/_components/modal-continuidade-aluno.tsx) | 16 | 118 | 0 | 9 | 6 |
| [nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx) | 29 | 186 | 0 | 18 | 7 |
| [nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx) | 20 | 118 | 0 | 6 | 9 |
| [nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx](../src/app/nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx) | 7 | 28 | 0 | 0 | 0 |
| [nexus/diretoria/alunos/_components/vinculos-importacao.tsx](../src/app/nexus/diretoria/alunos/_components/vinculos-importacao.tsx) | 9 | 36 | 0 | 2 | 2 |
| [nexus/diretoria/alunos/[id]/_components/ficha-cadastral-aluno.tsx](../src/app/nexus/diretoria/alunos/%5Bid%5D/_components/ficha-cadastral-aluno.tsx) | 11 | 44 | 0 | 0 | 0 |
| [nexus/diretoria/alunos/[id]/_components/historico-matriculas-aluno.tsx](../src/app/nexus/diretoria/alunos/%5Bid%5D/_components/historico-matriculas-aluno.tsx) | 9 | 36 | 0 | 0 | 0 |
| [nexus/diretoria/alunos/[id]/page.tsx](../src/app/nexus/diretoria/alunos/%5Bid%5D/page.tsx) | 6 | 32 | 0 | 2 | 3 |
| [nexus/diretoria/alunos/page.tsx](../src/app/nexus/diretoria/alunos/page.tsx) | 6 | 36 | 0 | 2 | 3 |
| [nexus/diretoria/conecta/_components/conecta-semestre.tsx](../src/app/nexus/diretoria/conecta/_components/conecta-semestre.tsx) | 3 | 12 | 0 | 0 | 0 |
| [nexus/diretoria/conecta/_components/doacoes.tsx](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx) | 27 | 156 | 0 | 9 | 0 |
| [nexus/diretoria/conecta/_components/equipes.tsx](../src/app/nexus/diretoria/conecta/_components/equipes.tsx) | 24 | 136 | 0 | 9 | 0 |
| [nexus/diretoria/conecta/_components/itens.tsx](../src/app/nexus/diretoria/conecta/_components/itens.tsx) | 22 | 128 | 0 | 8 | 0 |
| [nexus/diretoria/conecta/_components/provas.tsx](../src/app/nexus/diretoria/conecta/_components/provas.tsx) | 24 | 152 | 0 | 9 | 1 |
| [nexus/diretoria/conecta/_components/ranking.tsx](../src/app/nexus/diretoria/conecta/_components/ranking.tsx) | 30 | 180 | 24 | 0 | 0 |
| [nexus/diretoria/conecta/page.tsx](../src/app/nexus/diretoria/conecta/page.tsx) | 8 | 62 | 0 | 2 | 0 |
| [nexus/diretoria/diretores/_components/formulario-diretor.tsx](../src/app/nexus/diretoria/diretores/_components/formulario-diretor.tsx) | 8 | 50 | 0 | 5 | 2 |
| [nexus/diretoria/diretores/_components/lista-diretores.tsx](../src/app/nexus/diretoria/diretores/_components/lista-diretores.tsx) | 11 | 50 | 38 | 0 | 0 |
| [nexus/diretoria/diretores/page.tsx](../src/app/nexus/diretoria/diretores/page.tsx) | 5 | 32 | 0 | 3 | 2 |
| [nexus/diretoria/estoque/_components/card-item.tsx](../src/app/nexus/diretoria/estoque/_components/card-item.tsx) | 10 | 44 | 0 | 0 | 3 |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx) | 6 | 48 | 0 | 3 | 2 |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx) | 12 | 90 | 0 | 5 | 2 |
| [nexus/diretoria/estoque/_components/formulario-item.tsx](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx) | 16 | 138 | 0 | 9 | 6 |
| [nexus/diretoria/estoque/page.tsx](../src/app/nexus/diretoria/estoque/page.tsx) | 13 | 68 | 0 | 4 | 2 |
| [nexus/diretoria/formularios/_components/acoes-formulario.tsx](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx) | 6 | 26 | 26 | 0 | 0 |
| [nexus/diretoria/formularios/_components/cabecalho-formulario.tsx](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx) | 4 | 108 | 0 | 4 | 4 |
| [nexus/diretoria/formularios/_components/configuracoes-formulario.tsx](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx) | 23 | 132 | 0 | 11 | 4 |
| [nexus/diretoria/formularios/_components/icone-opcao.tsx](../src/app/nexus/diretoria/formularios/_components/icone-opcao.tsx) | 2 | 8 | 0 | 0 | 0 |
| [nexus/diretoria/formularios/_components/pergunta-editor.tsx](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx) | 23 | 418 | 8 | 21 | 10 |
| [nexus/diretoria/formularios/page.tsx](../src/app/nexus/diretoria/formularios/page.tsx) | 7 | 50 | 0 | 4 | 3 |
| [nexus/diretoria/impressao/_components/acoes-impressao.tsx](../src/app/nexus/diretoria/impressao/_components/acoes-impressao.tsx) | 13 | 128 | 0 | 5 | 0 |
| [nexus/diretoria/impressao/_components/campo.tsx](../src/app/nexus/diretoria/impressao/_components/campo.tsx) | 2 | 16 | 0 | 1 | 0 |
| [nexus/diretoria/impressao/_components/editor.tsx](../src/app/nexus/diretoria/impressao/_components/editor.tsx) | 16 | 104 | 0 | 7 | 5 |
| [nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx](../src/app/nexus/diretoria/impressao/_components/lista-semanas-impressao.tsx) | 24 | 138 | 0 | 5 | 3 |
| [nexus/diretoria/impressao/_components/status-button.tsx](../src/app/nexus/diretoria/impressao/_components/status-button.tsx) | 5 | 28 | 0 | 1 | 0 |
| [nexus/diretoria/impressao/page.tsx](../src/app/nexus/diretoria/impressao/page.tsx) | 9 | 68 | 0 | 3 | 0 |
| [nexus/diretoria/layout.tsx](../src/app/nexus/diretoria/layout.tsx) | 1 | 4 | 0 | 0 | 0 |
| [nexus/diretoria/materiais-atualizacao/_components/editor.tsx](../src/app/nexus/diretoria/materiais-atualizacao/_components/editor.tsx) | 10 | 80 | 0 | 5 | 0 |
| [nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx](../src/app/nexus/diretoria/materiais-atualizacao/_components/lista-materiais-atualizacao.tsx) | 15 | 106 | 0 | 2 | 0 |
| [nexus/diretoria/materiais-atualizacao/_components/status.tsx](../src/app/nexus/diretoria/materiais-atualizacao/_components/status.tsx) | 4 | 24 | 0 | 0 | 0 |
| [nexus/diretoria/materiais-atualizacao/page.tsx](../src/app/nexus/diretoria/materiais-atualizacao/page.tsx) | 16 | 138 | 0 | 7 | 1 |
| [nexus/diretoria/monitores/_components/acoes-monitores.tsx](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx) | 12 | 100 | 0 | 6 | 4 |
| [nexus/diretoria/monitores/_components/formulario-monitor.tsx](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx) | 22 | 160 | 0 | 17 | 9 |
| [nexus/diretoria/monitores/_components/monitor-card.tsx](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx) | 13 | 72 | 0 | 6 | 3 |
| [nexus/diretoria/monitores/page.tsx](../src/app/nexus/diretoria/monitores/page.tsx) | 2 | 12 | 0 | 1 | 0 |
| [nexus/diretoria/page.tsx](../src/app/nexus/diretoria/page.tsx) | 7 | 28 | 0 | 2 | 2 |
| [nexus/diretoria/presencas/_components/historico-presencas.tsx](../src/app/nexus/diretoria/presencas/_components/historico-presencas.tsx) | 7 | 30 | 0 | 3 | 0 |
| [nexus/diretoria/presencas/_components/planilhas-presencas.tsx](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx) | 10 | 64 | 0 | 1 | 0 |
| [nexus/diretoria/presencas/page.tsx](../src/app/nexus/diretoria/presencas/page.tsx) | 16 | 162 | 0 | 10 | 6 |
| [nexus/diretoria/professores/_components/acoes-professores.tsx](../src/app/nexus/diretoria/professores/_components/acoes-professores.tsx) | 6 | 50 | 0 | 3 | 4 |
| [nexus/diretoria/professores/_components/formulario-professor.tsx](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx) | 22 | 160 | 0 | 16 | 8 |
| [nexus/diretoria/professores/_components/professor-card.tsx](../src/app/nexus/diretoria/professores/_components/professor-card.tsx) | 13 | 72 | 0 | 9 | 4 |
| [nexus/diretoria/professores/page.tsx](../src/app/nexus/diretoria/professores/page.tsx) | 1 | 4 | 0 | 1 | 0 |
| [nexus/diretoria/questionarios/_components/lista-questionarios.tsx](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx) | 21 | 98 | 0 | 5 | 5 |
| [nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx) | 7 | 50 | 0 | 3 | 2 |
| [nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx) | 7 | 32 | 0 | 2 | 3 |
| [nexus/diretoria/questionarios/[id]/_components/analytics-question.tsx](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/analytics-question.tsx) | 9 | 36 | 0 | 0 | 2 |
| [nexus/diretoria/questionarios/[id]/_components/respostas-individuais-questionario.tsx](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx) | 11 | 64 | 0 | 4 | 4 |
| [nexus/diretoria/questionarios/[id]/page.tsx](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx) | 6 | 72 | 0 | 7 | 5 |
| [nexus/diretoria/questionarios/page.tsx](../src/app/nexus/diretoria/questionarios/page.tsx) | 5 | 56 | 0 | 6 | 3 |
| [nexus/diretoria/semestres/_components/lista-semestres.tsx](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx) | 9 | 68 | 0 | 6 | 5 |
| [nexus/diretoria/semestres/_components/resumo.tsx](../src/app/nexus/diretoria/semestres/_components/resumo.tsx) | 2 | 8 | 0 | 1 | 0 |
| [nexus/diretoria/semestres/page.tsx](../src/app/nexus/diretoria/semestres/page.tsx) | 11 | 112 | 0 | 9 | 6 |
| [nexus/diretoria/sorteio/_components/card-candidato.tsx](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx) | 11 | 66 | 0 | 3 | 4 |
| [nexus/diretoria/sorteio/_components/filtros-sorteio.tsx](../src/app/nexus/diretoria/sorteio/_components/filtros-sorteio.tsx) | 7 | 64 | 0 | 6 | 2 |
| [nexus/diretoria/sorteio/_components/listas-candidatos.tsx](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx) | 8 | 32 | 0 | 5 | 2 |
| [nexus/diretoria/sorteio/_components/modal-candidato.tsx](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx) | 32 | 318 | 0 | 31 | 17 |
| [nexus/diretoria/sorteio/page.tsx](../src/app/nexus/diretoria/sorteio/page.tsx) | 8 | 64 | 0 | 3 | 0 |
| [nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx) | 16 | 128 | 4 | 11 | 9 |
| [nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx) | 40 | 402 | 6 | 29 | 24 |
| [nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx) | 8 | 32 | 0 | 5 | 7 |
| [nexus/diretoria/sorteio/sorteador/page.tsx](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx) | 5 | 20 | 4 | 3 | 1 |
| [nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx](../src/app/nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx) | 11 | 82 | 0 | 1 | 1 |
| [nexus/diretoria/turmas/_components/aulas-editor.tsx](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx) | 24 | 166 | 0 | 11 | 14 |
| [nexus/diretoria/turmas/_components/campo-ficha-aluno.tsx](../src/app/nexus/diretoria/turmas/_components/campo-ficha-aluno.tsx) | 2 | 8 | 0 | 0 | 0 |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx) | 4 | 16 | 0 | 1 | 0 |
| [nexus/diretoria/turmas/_components/ficha-aluno-completa.tsx](../src/app/nexus/diretoria/turmas/_components/ficha-aluno-completa.tsx) | 9 | 36 | 0 | 0 | 0 |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx) | 15 | 104 | 8 | 3 | 0 |
| [nexus/diretoria/turmas/_components/materiais-editor.tsx](../src/app/nexus/diretoria/turmas/_components/materiais-editor.tsx) | 17 | 122 | 0 | 10 | 4 |
| [nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx](../src/app/nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx) | 6 | 26 | 0 | 1 | 1 |
| [nexus/diretoria/turmas/_components/search-select.tsx](../src/app/nexus/diretoria/turmas/_components/search-select.tsx) | 11 | 66 | 0 | 8 | 2 |
| [nexus/diretoria/turmas/_components/turma-card.tsx](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx) | 17 | 104 | 6 | 7 | 5 |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx) | 27 | 184 | 0 | 13 | 10 |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx) | 13 | 52 | 0 | 1 | 6 |
| [nexus/diretoria/turmas/controle/page.tsx](../src/app/nexus/diretoria/turmas/controle/page.tsx) | 12 | 88 | 0 | 4 | 7 |
| [nexus/diretoria/turmas/page.tsx](../src/app/nexus/diretoria/turmas/page.tsx) | 12 | 94 | 0 | 6 | 5 |
| [nexus/layout.tsx](../src/app/nexus/layout.tsx) | 4 | 16 | 0 | 0 | 0 |
| [nexus/login/_components/apresentacao-login.tsx](../src/app/nexus/login/_components/apresentacao-login.tsx) | 6 | 12 | 0 | 5 | 5 |
| [nexus/login/_components/formulario-login.tsx](../src/app/nexus/login/_components/formulario-login.tsx) | 13 | 100 | 0 | 8 | 5 |
| [nexus/login/layout.tsx](../src/app/nexus/login/layout.tsx) | 1 | 4 | 0 | 0 | 0 |
| [nexus/login/page.tsx](../src/app/nexus/login/page.tsx) | 4 | 16 | 0 | 0 | 0 |
| [nexus/questionarios/editor/page.tsx](../src/app/nexus/questionarios/editor/page.tsx) | 1 | 4 | 0 | 0 | 0 |
| [nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx](../src/app/nexus/redefinir-senha/_components/formulario-redefinir-senha.tsx) | 12 | 110 | 0 | 9 | 5 |
| [nexus/redefinir-senha/page.tsx](../src/app/nexus/redefinir-senha/page.tsx) | 5 | 30 | 0 | 1 | 1 |
| [not-found.tsx](../src/app/not-found.tsx) | 11 | 72 | 0 | 7 | 4 |
| [questionarios/[slug]/_components/estado-enviado.tsx](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx) | 7 | 28 | 0 | 3 | 0 |
| [questionarios/[slug]/_components/estado-respondido.tsx](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx) | 5 | 28 | 0 | 3 | 0 |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx) | 12 | 76 | 0 | 7 | 6 |
| [questionarios/[slug]/_components/pergunta-campo.tsx](../src/app/questionarios/%5Bslug%5D/_components/pergunta-campo.tsx) | 6 | 56 | 0 | 6 | 2 |
| [questionarios/[slug]/page.tsx](../src/app/questionarios/%5Bslug%5D/page.tsx) | 3 | 12 | 0 | 0 | 0 |
| [trpc/react.tsx](../src/trpc/react.tsx) | 1 | 4 | 0 | 0 | 0 |

## Classes de cor e efeitos encontradas no JSX

O total de referências conta locais encontrados nas alternativas que a análise estática conseguiu resolver. A coluna “Exemplo” aponta a primeira ocorrência de cada classe. Os efeitos incluem fundos, texto, bordas, gradientes, SVG, transparência e estados.

| Classe | Referências | Exemplo |
| --- | ---: | --- |
| `!text-[color:var(--turma-descricao)]` | 8 | [turma-dashboard-card.tsx:56](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L56) |
| `accent-emerald-700` | 1 | [lista-alunos.tsx:76](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L76) |
| `accent-orange-500` | 1 | [modal-importacao-alunos.tsx:204](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L204) |
| `accent-sky-600` | 1 | [modal-importacao-alunos.tsx:167](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L167) |
| `active:bg-amber-700` | 1 | [acoes-alunos.tsx:68](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L68) |
| `active:bg-slate-50` | 1 | [navegacao-turma-mobile.tsx:46](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L46) |
| `active:shadow-none` | 1 | [page.tsx:116](../src/app/nexus/diretoria/formularios/page.tsx#L116) |
| `active:shadow-sm` | 2 | [ferramentaCerd.tsx:17](../src/app/_components/ferramentaCerd.tsx#L17) |
| `backdrop:bg-slate-950/55` | 1 | [sincronizar-presencas-modal.tsx:32](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L32) |
| `bg-[radial-gradient(circle_at_92%_5%,rgba(14,165,233,.16),transparent_22rem),radial-gradient(circle_at_10%_75%,rgba(249,115,22,.10),transparent_18rem),#f8fafc]` | 1 | [page.tsx:62](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx#L62) |
| `bg-[radial-gradient(circle_at_95%_0%,rgba(14,165,233,.14),transparent_25rem),radial-gradient(circle_at_76%_12rem,rgba(249,115,22,.1),transparent_19rem),#f8fafc]` | 1 | [page.tsx:21](../src/app/nexus/dashboard/page.tsx#L21) |
| `bg-[var(--nexus-surface-soft)]` | 1 | [doacoes.tsx:139](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L139) |
| `bg-[var(--nexus-surface)]` | 2 | [painel-tour.tsx:127](../src/app/_components/screen-tour/painel-tour.tsx#L127) |
| `bg-amber-100` | 2 | [modal-vinculo-turmas-em-lote.tsx:98](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L98) |
| `bg-amber-300` | 1 | [inscricoes.tsx:96](../src/app/_components/home/inscricoes.tsx#L96) |
| `bg-amber-400` | 2 | [acesso-nexus.tsx:7](../src/app/_components/home/_components/acesso-nexus.tsx#L7) |
| `bg-amber-50` | 15 | [page.tsx:89](../src/app/nexus/configuracoes/page.tsx#L89) |
| `bg-amber-50/50` | 1 | [listas-candidatos.tsx:63](../src/app/nexus/diretoria/sorteio/_components/listas-candidatos.tsx#L63) |
| `bg-amber-500` | 9 | [canais-atendimento.tsx:147](../src/app/_components/home/_components/canais-atendimento.tsx#L147) |
| `bg-amber-500/20` | 1 | [professor-card.tsx:21](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L21) |
| `bg-amber-600` | 2 | [acoes-formulario.tsx:19](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L19) |
| `bg-amber-600/20` | 3 | [diretoria-workspace.tsx:31](../src/app/_components/diretoria-workspace.tsx#L31) |
| `bg-base-100` | 1 | [galeria.tsx:97](../src/app/_components/home/galeria.tsx#L97) |
| `bg-black` | 1 | [noticias.tsx:58](../src/app/_components/home/noticias.tsx#L58) |
| `bg-black/10` | 1 | [noticias.tsx:66](../src/app/_components/home/noticias.tsx#L66) |
| `bg-black/20` | 1 | [galeria.tsx:118](../src/app/_components/home/galeria.tsx#L118) |
| `bg-black/30` | 2 | [galeria.tsx:126](../src/app/_components/home/galeria.tsx#L126) |
| `bg-black/50` | 1 | [galeria.tsx:141](../src/app/_components/home/galeria.tsx#L141) |
| `bg-blue-50` | 1 | [navbar.tsx:140](../src/app/_components/home/navbar.tsx#L140) |
| `bg-blue-500` | 1 | [layout.tsx:31](../src/app/nexus/layout.tsx#L31) |
| `bg-emerald-100` | 1 | [monitor-card.tsx:21](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L21) |
| `bg-emerald-50` | 7 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `bg-emerald-700` | 2 | [acoes-alunos.tsx:129](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L129) |
| `bg-gradient-to-br` | 4 | [canais-atendimento.tsx:3](../src/app/_components/home/_components/canais-atendimento.tsx#L3) |
| `bg-gradient-to-r` | 5 | [acesso-nexus.tsx:5](../src/app/_components/home/_components/acesso-nexus.tsx#L5) |
| `bg-gray-100` | 7 | [ImageWithFallback.tsx:17](../src/app/_components/home/ImageWithFallback.tsx#L17) |
| `bg-gray-200` | 3 | [calendario-aulas.tsx:105](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L105) |
| `bg-gray-400` | 1 | [resultado-sorteio.tsx:50](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L50) |
| `bg-gray-50` | 74 | [contatos.tsx:40](../src/app/_components/home/contatos.tsx#L40) |
| `bg-gray-50/50` | 3 | [detalhes-calendario.tsx:108](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L108) |
| `bg-gray-50/60` | 1 | [calendario-aulas.tsx:87](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L87) |
| `bg-gray-50/70` | 1 | [presenca-view.tsx:183](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L183) |
| `bg-gray-900` | 1 | [acesso-nexus.tsx:41](../src/app/_components/home/_components/acesso-nexus.tsx#L41) |
| `bg-gray-900/40` | 1 | [modal-candidato.tsx:38](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L38) |
| `bg-gray-900/50` | 2 | [editar-turma-modal.tsx:42](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L42) |
| `bg-green-100` | 1 | [confirmacao-presenca-modal.tsx:26](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L26) |
| `bg-green-50` | 4 | [pergunta-editor.tsx:131](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L131) |
| `bg-green-500` | 1 | [analytics-question.tsx:76](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/analytics-question.tsx#L76) |
| `bg-linear-to-r` | 1 | [ranking.tsx:154](../src/app/nexus/diretoria/conecta/_components/ranking.tsx#L154) |
| `bg-orange-100` | 9 | [people-management-card.tsx:46](../src/app/_components/diretoria/people-management-card.tsx#L46) |
| `bg-orange-400` | 3 | [data-skeleton.tsx:14](../src/app/_components/diretoria/data-skeleton.tsx#L14) |
| `bg-orange-400/90` | 1 | [apresentacao-login.tsx:18](../src/app/nexus/login/_components/apresentacao-login.tsx#L18) |
| `bg-orange-50` | 16 | [people-management-card.tsx:109](../src/app/_components/diretoria/people-management-card.tsx#L109) |
| `bg-orange-500` | 18 | [page-intro.tsx:19](../src/app/_components/diretoria/page-intro.tsx#L19) |
| `bg-orange-600` | 2 | [historico-sorteador.tsx:24](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L24) |
| `bg-orange-700` | 2 | [project-code-modal.tsx:119](../src/app/_components/diretoria/project-code-modal.tsx#L119) |
| `bg-red-100` | 2 | [lista-alunos.tsx:154](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L154) |
| `bg-red-50` | 17 | [force-password-change.tsx:186](../src/app/_components/force-password-change.tsx#L186) |
| `bg-red-600` | 1 | [modal-excluir-questionario.tsx:72](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L72) |
| `bg-red-700` | 1 | [page.tsx:134](../src/app/nexus/diretoria/turmas/page.tsx#L134) |
| `bg-sky-100` | 17 | [people-management-card.tsx:46](../src/app/_components/diretoria/people-management-card.tsx#L46) |
| `bg-sky-200` | 1 | [page.tsx:66](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx#L66) |
| `bg-sky-300/50` | 1 | [historico-sorteador.tsx:25](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L25) |
| `bg-sky-400` | 1 | [acesso-nexus.tsx:6](../src/app/_components/home/_components/acesso-nexus.tsx#L6) |
| `bg-sky-50` | 35 | [people-management-card.tsx:109](../src/app/_components/diretoria/people-management-card.tsx#L109) |
| `bg-sky-50/50` | 4 | [campos-turma-aluno.tsx:16](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L16) |
| `bg-sky-50/60` | 7 | [acessibilidade-sidebar.tsx:21](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L21) |
| `bg-sky-50/65` | 1 | [data-skeleton.tsx:28](../src/app/_components/diretoria/data-skeleton.tsx#L28) |
| `bg-sky-50/70` | 3 | [data-skeleton.tsx:13](../src/app/_components/diretoria/data-skeleton.tsx#L13) |
| `bg-sky-500` | 5 | [people-management-card.tsx:42](../src/app/_components/diretoria/people-management-card.tsx#L42) |
| `bg-sky-500/50` | 1 | [canais-atendimento.tsx:76](../src/app/_components/home/_components/canais-atendimento.tsx#L76) |
| `bg-sky-600` | 51 | [force-password-change.tsx:77](../src/app/_components/force-password-change.tsx#L77) |
| `bg-sky-600/25` | 3 | [diretoria-workspace.tsx:30](../src/app/_components/diretoria-workspace.tsx#L30) |
| `bg-sky-600/50` | 1 | [galeria.tsx:111](../src/app/_components/home/galeria.tsx#L111) |
| `bg-sky-700` | 10 | [sincronizar-presencas-modal.tsx:48](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L48) |
| `bg-sky-800` | 1 | [canais-atendimento.tsx:146](../src/app/_components/home/_components/canais-atendimento.tsx#L146) |
| `bg-sky-950/10` | 1 | [acesso-rapido.tsx:17](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L17) |
| `bg-sky-950/60` | 1 | [force-password-change.tsx:67](../src/app/_components/force-password-change.tsx#L67) |
| `bg-slate-100` | 7 | [presence-grid.tsx:72](../src/app/_components/diretoria/presence-grid.tsx#L72) |
| `bg-slate-200` | 5 | [presence-grid.tsx:168](../src/app/_components/diretoria/presence-grid.tsx#L168) |
| `bg-slate-300` | 3 | [navbar.tsx:72](../src/app/_components/home/navbar.tsx#L72) |
| `bg-slate-50` | 25 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `bg-slate-50/70` | 1 | [presence-grid.tsx:141](../src/app/_components/diretoria/presence-grid.tsx#L141) |
| `bg-slate-950/35` | 1 | [sidebar.tsx:101](../src/app/_components/sidebar.tsx#L101) |
| `bg-slate-950/45` | 7 | [project-code-modal.tsx:60](../src/app/_components/diretoria/project-code-modal.tsx#L60) |
| `bg-slate-950/55` | 2 | [confirmacao-presenca-modal.tsx:21](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L21) |
| `bg-slate-950/65` | 1 | [painel-tour.tsx:42](../src/app/_components/screen-tour/painel-tour.tsx#L42) |
| `bg-transparent` | 9 | [galeria.tsx:112](../src/app/_components/home/galeria.tsx#L112) |
| `bg-violet-100` | 2 | [painel-tamanho-texto.tsx:18](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L18) |
| `bg-violet-600` | 1 | [formulario-professor.tsx:139](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L139) |
| `bg-white` | 186 | [data-skeleton.tsx:12](../src/app/_components/diretoria/data-skeleton.tsx#L12) |
| `bg-white/10` | 7 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `bg-white/15` | 8 | [force-password-change.tsx:86](../src/app/_components/force-password-change.tsx#L86) |
| `bg-white/18` | 1 | [acesso-rapido.tsx:20](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L20) |
| `bg-white/20` | 9 | [canais-atendimento.tsx:11](../src/app/_components/home/_components/canais-atendimento.tsx#L11) |
| `bg-white/35` | 1 | [apresentacao-login.tsx:29](../src/app/nexus/login/_components/apresentacao-login.tsx#L29) |
| `bg-white/70` | 2 | [acesso-nexus.tsx:10](../src/app/_components/home/_components/acesso-nexus.tsx#L10) |
| `bg-white/80` | 2 | [navbar.tsx:57](../src/app/_components/home/navbar.tsx#L57) |
| `bg-white/85` | 1 | [sugestoes-turma-importacao.tsx:33](../src/app/nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx#L33) |
| `bg-white/95` | 2 | [navbar.tsx:130](../src/app/_components/home/navbar.tsx#L130) |
| `border-[11px]` | 1 | [cabecalho-turma.tsx:36](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L36) |
| `border-[12px]` | 3 | [page.tsx:33](../src/app/nexus/configuracoes/page.tsx#L33) |
| `border-[14px]` | 2 | [page.tsx:32](../src/app/nexus/dashboard/page.tsx#L32) |
| `border-[18px]` | 1 | [apresentacao-login.tsx:14](../src/app/nexus/login/_components/apresentacao-login.tsx#L14) |
| `border-[9px]` | 1 | [force-password-change.tsx:84](../src/app/_components/force-password-change.tsx#L84) |
| `border-[var(--nexus-line)]` | 3 | [painel-tour.tsx:101](../src/app/_components/screen-tour/painel-tour.tsx#L101) |
| `border-0` | 2 | [janela-gestao-turma.tsx:139](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L139) |
| `border-2` | 3 | [theme-option.tsx:18](../src/app/nexus/acessibilidade/_components/theme-option.tsx#L18) |
| `border-3` | 1 | [acoes-formulario.tsx:24](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L24) |
| `border-4` | 3 | [noticias.tsx:58](../src/app/_components/home/noticias.tsx#L58) |
| `border-amber-100` | 2 | [modal-vinculo-turmas-em-lote.tsx:102](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L102) |
| `border-amber-200` | 6 | [page.tsx:89](../src/app/nexus/configuracoes/page.tsx#L89) |
| `border-amber-300` | 2 | [modal-candidato.tsx:100](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L100) |
| `border-amber-400` | 1 | [modal-vinculo-turmas-em-lote.tsx:109](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L109) |
| `border-amber-500` | 5 | [canais-atendimento.tsx:6](../src/app/_components/home/_components/canais-atendimento.tsx#L6) |
| `border-amber-600` | 1 | [acoes-formulario.tsx:24](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L24) |
| `border-b` | 34 | [data-skeleton.tsx:13](../src/app/_components/diretoria/data-skeleton.tsx#L13) |
| `border-b-[7px]` | 1 | [modal-qr-questionario.tsx:49](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L49) |
| `border-b-2` | 7 | [pergunta-editor.tsx:170](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L170) |
| `border-b-4` | 7 | [canais-atendimento.tsx:6](../src/app/_components/home/_components/canais-atendimento.tsx#L6) |
| `border-b-amber-600` | 1 | [modal-qr-questionario.tsx:49](../src/app/nexus/diretoria/questionarios/_components/modal-qr-questionario.tsx#L49) |
| `border-dashed` | 10 | [page.tsx:78](../src/app/nexus/dashboard/page.tsx#L78) |
| `border-gray-100` | 28 | [acesso-nexus.tsx:13](../src/app/_components/home/_components/acesso-nexus.tsx#L13) |
| `border-gray-100/60` | 1 | [acesso-nexus.tsx:3](../src/app/_components/home/_components/acesso-nexus.tsx#L3) |
| `border-gray-200` | 131 | [ferramentaCerd.tsx:17](../src/app/_components/ferramentaCerd.tsx#L17) |
| `border-gray-300` | 12 | [campos-infraestrutura-aluno.tsx:95](../src/app/nexus/diretoria/alunos/_components/campos-infraestrutura-aluno.tsx#L95) |
| `border-l` | 4 | [lista-questionarios.tsx:103](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L103) |
| `border-l-2` | 1 | [navegacao-sidebar.tsx:208](../src/app/_components/sidebar/navegacao-sidebar.tsx#L208) |
| `border-none` | 4 | [galeria.tsx:126](../src/app/_components/home/galeria.tsx#L126) |
| `border-orange-200` | 6 | [navegacao-sidebar.tsx:208](../src/app/_components/sidebar/navegacao-sidebar.tsx#L208) |
| `border-r` | 1 | [sidebar.tsx:107](../src/app/_components/sidebar.tsx#L107) |
| `border-red-200` | 6 | [botaoSair.tsx:13](../src/app/nexus/configuracoes/botaoSair.tsx#L13) |
| `border-red-300` | 1 | [painel-sorteador.tsx:298](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L298) |
| `border-sky-100` | 31 | [data-skeleton.tsx:12](../src/app/_components/diretoria/data-skeleton.tsx#L12) |
| `border-sky-200` | 19 | [previa-acessibilidade.tsx:6](../src/app/nexus/acessibilidade/_components/previa-acessibilidade.tsx#L6) |
| `border-sky-200/75` | 1 | [modal-importacao-alunos.tsx:79](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L79) |
| `border-sky-200/80` | 3 | [force-password-change.tsx:84](../src/app/_components/force-password-change.tsx#L84) |
| `border-sky-300` | 4 | [page.tsx:33](../src/app/nexus/configuracoes/page.tsx#L33) |
| `border-sky-300/60` | 1 | [apresentacao-login.tsx:14](../src/app/nexus/login/_components/apresentacao-login.tsx#L14) |
| `border-sky-300/70` | 2 | [page.tsx:23](../src/app/nexus/diretoria/page.tsx#L23) |
| `border-sky-500` | 2 | [galeria.tsx:85](../src/app/_components/home/galeria.tsx#L85) |
| `border-sky-600` | 5 | [page.tsx:135](../src/app/nexus/diretoria/presencas/page.tsx#L135) |
| `border-sky-700` | 1 | [theme-option.tsx:18](../src/app/nexus/acessibilidade/_components/theme-option.tsx#L18) |
| `border-slate-100` | 16 | [data-skeleton.tsx:18](../src/app/_components/diretoria/data-skeleton.tsx#L18) |
| `border-slate-200` | 33 | [presence-grid.tsx:72](../src/app/_components/diretoria/presence-grid.tsx#L72) |
| `border-slate-300` | 11 | [project-code-modal.tsx:110](../src/app/_components/diretoria/project-code-modal.tsx#L110) |
| `border-t` | 28 | [data-skeleton.tsx:18](../src/app/_components/diretoria/data-skeleton.tsx#L18) |
| `border-t-white` | 1 | [formulario-login.tsx:98](../src/app/nexus/login/_components/formulario-login.tsx#L98) |
| `border-transparent` | 5 | [calendario-aulas.tsx:160](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L160) |
| `border-white` | 2 | [acesso-nexus.tsx:10](../src/app/_components/home/_components/acesso-nexus.tsx#L10) |
| `border-white/10` | 1 | [galeria.tsx:138](../src/app/_components/home/galeria.tsx#L138) |
| `border-white/20` | 7 | [canais-atendimento.tsx:151](../src/app/_components/home/_components/canais-atendimento.tsx#L151) |
| `border-white/40` | 1 | [formulario-login.tsx:98](../src/app/nexus/login/_components/formulario-login.tsx#L98) |
| `dark:[&_.diretoria-back-link]:text-sky-300` | 1 | [page.tsx:32](../src/app/nexus/diretoria/conecta/page.tsx#L32) |
| `dark:bg-amber-950` | 1 | [janela-gestao-turma.tsx:193](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L193) |
| `dark:bg-amber-950/60` | 2 | [lista-alunos.tsx:128](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L128) |
| `dark:bg-emerald-600` | 1 | [acoes-alunos.tsx:129](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L129) |
| `dark:bg-emerald-950` | 1 | [conecta-semestre.tsx:47](../src/app/nexus/diretoria/conecta/_components/conecta-semestre.tsx#L47) |
| `dark:bg-emerald-950/60` | 3 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `dark:bg-orange-950/50` | 2 | [modal-importacao-alunos.tsx:184](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L184) |
| `dark:bg-orange-950/60` | 2 | [page.tsx:58](../src/app/nexus/dashboard/page.tsx#L58) |
| `dark:bg-red-950` | 1 | [conecta-semestre.tsx:39](../src/app/nexus/diretoria/conecta/_components/conecta-semestre.tsx#L39) |
| `dark:bg-red-950/60` | 1 | [lista-alunos.tsx:154](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L154) |
| `dark:bg-sky-950/40` | 1 | [sugestoes-turma-importacao.tsx:13](../src/app/nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx#L13) |
| `dark:bg-sky-950/50` | 3 | [page.tsx:67](../src/app/nexus/dashboard/page.tsx#L67) |
| `dark:bg-sky-950/60` | 1 | [lista-alunos.tsx:145](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L145) |
| `dark:bg-sky-950/70` | 2 | [modal-importacao-alunos.tsx:142](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L142) |
| `dark:bg-slate-700` | 1 | [painel-tour.tsx:113](../src/app/_components/screen-tour/painel-tour.tsx#L113) |
| `dark:bg-slate-800` | 2 | [lista-alunos.tsx:69](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L69) |
| `dark:bg-slate-900` | 15 | [sincronizar-presencas-modal.tsx:32](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L32) |
| `dark:bg-slate-900/85` | 1 | [sugestoes-turma-importacao.tsx:33](../src/app/nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx#L33) |
| `dark:bg-slate-900/90` | 3 | [acessibilidade-sidebar.tsx:21](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L21) |
| `dark:bg-slate-950` | 3 | [sidebar.tsx:107](../src/app/_components/sidebar.tsx#L107) |
| `dark:bg-slate-950/80` | 1 | [vinculos-importacao.tsx:54](../src/app/nexus/diretoria/alunos/_components/vinculos-importacao.tsx#L54) |
| `dark:bg-violet-950/60` | 1 | [lista-alunos.tsx:116](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L116) |
| `dark:border-amber-700` | 1 | [janela-gestao-turma.tsx:193](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L193) |
| `dark:border-orange-900` | 2 | [modal-importacao-alunos.tsx:184](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L184) |
| `dark:border-sky-900` | 6 | [page.tsx:78](../src/app/nexus/dashboard/page.tsx#L78) |
| `dark:border-sky-950` | 4 | [acessibilidade-sidebar.tsx:21](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L21) |
| `dark:border-slate-600` | 2 | [sincronizar-presencas-modal.tsx:55](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L55) |
| `dark:border-slate-700` | 9 | [sidebar.tsx:107](../src/app/_components/sidebar.tsx#L107) |
| `dark:border-slate-800` | 1 | [lista-alunos.tsx:101](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L101) |
| `dark:divide-slate-700` | 1 | [alunos-gestao-turma.tsx:108](../src/app/nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx#L108) |
| `dark:hover:bg-amber-900` | 1 | [lista-alunos.tsx:128](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L128) |
| `dark:hover:bg-emerald-500` | 1 | [acoes-alunos.tsx:129](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L129) |
| `dark:hover:bg-emerald-900` | 1 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `dark:hover:bg-red-900` | 1 | [lista-alunos.tsx:154](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L154) |
| `dark:hover:bg-sky-900` | 1 | [lista-alunos.tsx:145](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L145) |
| `dark:hover:bg-sky-950/50` | 1 | [modal-importacao-alunos.tsx:112](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L112) |
| `dark:hover:bg-slate-700` | 1 | [lista-alunos.tsx:69](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L69) |
| `dark:hover:bg-slate-800` | 18 | [sincronizar-presencas-modal.tsx:55](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L55) |
| `dark:hover:bg-violet-900` | 1 | [lista-alunos.tsx:116](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L116) |
| `dark:hover:text-sky-200` | 2 | [acessibilidade-sidebar.tsx:102](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L102) |
| `dark:hover:text-white` | 1 | [sidebar.tsx:166](../src/app/_components/sidebar.tsx#L166) |
| `dark:placeholder:text-slate-400` | 1 | [alunos-gestao-turma.tsx:85](../src/app/nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx#L85) |
| `dark:shadow-[0_10px_24px_rgba(0,0,0,.24)]` | 1 | [lista-alunos.tsx:66](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L66) |
| `dark:text-amber-100` | 1 | [janela-gestao-turma.tsx:193](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L193) |
| `dark:text-amber-200` | 1 | [sugestoes-turma-importacao.tsx:48](../src/app/nexus/diretoria/alunos/_components/sugestoes-turma-importacao.tsx#L48) |
| `dark:text-amber-300` | 2 | [lista-alunos.tsx:128](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L128) |
| `dark:text-emerald-200` | 3 | [modal-importacao-alunos.tsx:229](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L229) |
| `dark:text-emerald-300` | 2 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `dark:text-orange-100` | 2 | [modal-importacao-alunos.tsx:197](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L197) |
| `dark:text-orange-200` | 3 | [page.tsx:58](../src/app/nexus/dashboard/page.tsx#L58) |
| `dark:text-red-200` | 1 | [conecta-semestre.tsx:39](../src/app/nexus/diretoria/conecta/_components/conecta-semestre.tsx#L39) |
| `dark:text-red-300` | 3 | [painel-tour.tsx:140](../src/app/_components/screen-tour/painel-tour.tsx#L140) |
| `dark:text-sky-100` | 3 | [modal-importacao-alunos.tsx:159](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L159) |
| `dark:text-sky-200` | 9 | [painel-tour.tsx:101](../src/app/_components/screen-tour/painel-tour.tsx#L101) |
| `dark:text-sky-300` | 4 | [painel-tour.tsx:69](../src/app/_components/screen-tour/painel-tour.tsx#L69) |
| `dark:text-slate-100` | 15 | [sincronizar-presencas-modal.tsx:32](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L32) |
| `dark:text-slate-200` | 6 | [painel-tour.tsx:94](../src/app/_components/screen-tour/painel-tour.tsx#L94) |
| `dark:text-slate-300` | 18 | [sincronizar-presencas-modal.tsx:39](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L39) |
| `dark:text-slate-400` | 3 | [sidebar.tsx:140](../src/app/_components/sidebar.tsx#L140) |
| `dark:text-violet-300` | 1 | [lista-alunos.tsx:116](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L116) |
| `disabled:opacity-30` | 1 | [lista-semestres.tsx:112](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L112) |
| `disabled:opacity-40` | 3 | [painel-tamanho-texto.tsx:33](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L33) |
| `disabled:opacity-50` | 29 | [project-code-modal.tsx:84](../src/app/_components/diretoria/project-code-modal.tsx#L84) |
| `disabled:opacity-60` | 12 | [force-password-change.tsx:193](../src/app/_components/force-password-change.tsx#L193) |
| `divide-gray-100` | 4 | [page.tsx:56](../src/app/nexus/configuracoes/page.tsx#L56) |
| `divide-slate-100` | 3 | [presence-grid.tsx:183](../src/app/_components/diretoria/presence-grid.tsx#L183) |
| `divide-slate-200` | 3 | [presence-grid.tsx:144](../src/app/_components/diretoria/presence-grid.tsx#L144) |
| `divide-y` | 10 | [presence-grid.tsx:144](../src/app/_components/diretoria/presence-grid.tsx#L144) |
| `fill-current` | 1 | [pergunta-editor.tsx:78](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L78) |
| `focus-visible:outline-2` | 17 | [sincronizar-presencas-modal.tsx:48](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L48) |
| `focus-visible:outline-none` | 29 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `focus-visible:outline-offset-2` | 6 | [sincronizar-presencas-modal.tsx:48](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L48) |
| `focus-visible:outline-orange-500` | 1 | [screen-tour.tsx:282](../src/app/_components/screen-tour.tsx#L282) |
| `focus-visible:outline-red-700` | 1 | [card-item.tsx:41](../src/app/nexus/diretoria/estoque/_components/card-item.tsx#L41) |
| `focus-visible:outline-sky-400` | 1 | [painel-tour.tsx:170](../src/app/_components/screen-tour/painel-tour.tsx#L170) |
| `focus-visible:outline-sky-600` | 14 | [sincronizar-presencas-modal.tsx:48](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L48) |
| `focus-visible:ring-2` | 27 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `focus-visible:ring-4` | 1 | [force-password-change.tsx:193](../src/app/_components/force-password-change.tsx#L193) |
| `focus-visible:ring-amber-500` | 1 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `focus-visible:ring-inset` | 3 | [presence-grid.tsx:153](../src/app/_components/diretoria/presence-grid.tsx#L153) |
| `focus-visible:ring-offset-2` | 20 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `focus-visible:ring-offset-4` | 1 | [turma-dashboard-card.tsx:13](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L13) |
| `focus-visible:ring-orange-500` | 6 | [people-management-card.tsx:75](../src/app/_components/diretoria/people-management-card.tsx#L75) |
| `focus-visible:ring-red-500` | 2 | [people-management-card.tsx:95](../src/app/_components/diretoria/people-management-card.tsx#L95) |
| `focus-visible:ring-sky-200` | 1 | [force-password-change.tsx:193](../src/app/_components/force-password-change.tsx#L193) |
| `focus-visible:ring-sky-500` | 7 | [people-management-card.tsx:85](../src/app/_components/diretoria/people-management-card.tsx#L85) |
| `focus-visible:ring-sky-600` | 3 | [formulario-login.tsx:93](../src/app/nexus/login/_components/formulario-login.tsx#L93) |
| `focus-visible:ring-sky-700` | 1 | [painel-tamanho-texto.tsx:47](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L47) |
| `focus-visible:ring-white` | 2 | [cabecalho-turma.tsx:48](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L48) |
| `focus-within:border-sky-500` | 1 | [acoes-alunos.tsx:54](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L54) |
| `focus-within:ring-1` | 1 | [acoes-alunos.tsx:54](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L54) |
| `focus-within:ring-2` | 1 | [formulario-item.tsx:93](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L93) |
| `focus-within:ring-sky-500` | 1 | [acoes-alunos.tsx:54](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L54) |
| `focus-within:ring-sky-600` | 1 | [formulario-item.tsx:93](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L93) |
| `focus:bg-gray-50` | 1 | [pergunta-editor.tsx:104](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L104) |
| `focus:bg-white` | 32 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `focus:border-emerald-300` | 3 | [formulario-monitor.tsx:53](../src/app/nexus/diretoria/monitores/_components/formulario-monitor.tsx#L53) |
| `focus:border-gray-200` | 1 | [pergunta-editor.tsx:104](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L104) |
| `focus:border-orange-500` | 3 | [project-code-modal.tsx:110](../src/app/_components/diretoria/project-code-modal.tsx#L110) |
| `focus:border-red-400` | 2 | [modal-candidato.tsx:190](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L190) |
| `focus:border-sky-300` | 25 | [anotacoes-view.tsx:80](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L80) |
| `focus:border-sky-500` | 40 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `focus:border-sky-600` | 3 | [configuracoes-formulario.tsx:133](../src/app/nexus/diretoria/formularios/_components/configuracoes-formulario.tsx#L133) |
| `focus:border-teal-500` | 1 | [page.tsx:51](../src/app/nexus/diretoria/semestres/page.tsx#L51) |
| `focus:border-violet-300` | 3 | [formulario-professor.tsx:48](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L48) |
| `focus:outline-none` | 42 | [presence-grid.tsx:83](../src/app/_components/diretoria/presence-grid.tsx#L83) |
| `focus:ring-1` | 7 | [campos-turma-aluno.tsx:29](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L29) |
| `focus:ring-2` | 13 | [presence-grid.tsx:83](../src/app/_components/diretoria/presence-grid.tsx#L83) |
| `focus:ring-4` | 7 | [force-password-change.tsx:114](../src/app/_components/force-password-change.tsx#L114) |
| `focus:ring-amber-500` | 1 | [modal-vinculo-turmas-em-lote.tsx:115](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L115) |
| `focus:ring-offset-1` | 1 | [presence-grid.tsx:83](../src/app/_components/diretoria/presence-grid.tsx#L83) |
| `focus:ring-orange-100` | 2 | [project-code-modal.tsx:110](../src/app/_components/diretoria/project-code-modal.tsx#L110) |
| `focus:ring-red-100` | 1 | [painel-sorteador.tsx:298](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L298) |
| `focus:ring-red-400` | 1 | [modal-candidato.tsx:190](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L190) |
| `focus:ring-sky-100` | 14 | [force-password-change.tsx:114](../src/app/_components/force-password-change.tsx#L114) |
| `focus:ring-sky-200` | 1 | [painel-sorteador.tsx:246](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L246) |
| `focus:ring-sky-500` | 6 | [campos-turma-aluno.tsx:29](../src/app/nexus/diretoria/alunos/_components/campos-turma-aluno.tsx#L29) |
| `focus:ring-sky-500/20` | 2 | [respostas-individuais-questionario.tsx:40](../src/app/nexus/diretoria/questionarios/%5Bid%5D/_components/respostas-individuais-questionario.tsx#L40) |
| `from-amber-400` | 1 | [pessalGaleria.tsx:13](../src/app/_components/home/pessalGaleria.tsx#L13) |
| `from-amber-700` | 1 | [lista-diretores.tsx:26](../src/app/nexus/diretoria/diretores/_components/lista-diretores.tsx#L26) |
| `from-gray-100` | 1 | [pessalGaleria.tsx:14](../src/app/_components/home/pessalGaleria.tsx#L14) |
| `from-sky-500` | 1 | [not-found.tsx:28](../src/app/not-found.tsx#L28) |
| `from-sky-600` | 4 | [acesso-nexus.tsx:26](../src/app/_components/home/_components/acesso-nexus.tsx#L26) |
| `from-transparent` | 1 | [acesso-nexus.tsx:5](../src/app/_components/home/_components/acesso-nexus.tsx#L5) |
| `group-hover:bg-amber-500` | 2 | [canais-atendimento.tsx:11](../src/app/_components/home/_components/canais-atendimento.tsx#L11) |
| `group-hover:bg-transparent` | 1 | [noticias.tsx:66](../src/app/_components/home/noticias.tsx#L66) |
| `group-hover:border-amber-400` | 1 | [pessalGaleria.tsx:14](../src/app/_components/home/pessalGaleria.tsx#L14) |
| `group-hover:opacity-100` | 3 | [card-aviso.tsx:40](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L40) |
| `group-hover:opacity-20` | 2 | [acesso-nexus.tsx:6](../src/app/_components/home/_components/acesso-nexus.tsx#L6) |
| `group-hover:opacity-75` | 1 | [pessalGaleria.tsx:13](../src/app/_components/home/pessalGaleria.tsx#L13) |
| `group-hover:text-black` | 1 | [pessalGaleria.tsx:23](../src/app/_components/home/pessalGaleria.tsx#L23) |
| `group-hover:text-gray-400` | 1 | [pergunta-editor.tsx:44](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L44) |
| `group-hover:text-gray-500` | 1 | [ferramentaCerd.tsx:29](../src/app/_components/ferramentaCerd.tsx#L29) |
| `group-hover:text-sky-900` | 2 | [canais-atendimento.tsx:11](../src/app/_components/home/_components/canais-atendimento.tsx#L11) |
| `group-hover/btn:opacity-100` | 1 | [acesso-nexus.tsx:44](../src/app/_components/home/_components/acesso-nexus.tsx#L44) |
| `hover:bg-[var(--nexus-hover)]` | 1 | [page.tsx:51](../src/app/nexus/diretoria/conecta/page.tsx#L51) |
| `hover:bg-amber-100` | 1 | [lista-alunos.tsx:128](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L128) |
| `hover:bg-amber-50` | 2 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `hover:bg-amber-50/50` | 1 | [modal-vinculo-turmas-em-lote.tsx:109](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L109) |
| `hover:bg-amber-500/50` | 1 | [galeria.tsx:118](../src/app/_components/home/galeria.tsx#L118) |
| `hover:bg-amber-600` | 1 | [acoes-alunos.tsx:68](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L68) |
| `hover:bg-black/10` | 2 | [search-select.tsx:69](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L69) |
| `hover:bg-emerald-100` | 1 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `hover:bg-emerald-50` | 1 | [monitor-card.tsx:42](../src/app/nexus/diretoria/monitores/_components/monitor-card.tsx#L42) |
| `hover:bg-emerald-800` | 2 | [acoes-alunos.tsx:129](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L129) |
| `hover:bg-gradient-to-tr` | 3 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `hover:bg-gray-100` | 14 | [sidebar.tsx:140](../src/app/_components/sidebar.tsx#L140) |
| `hover:bg-gray-200` | 5 | [editar-turma-modal.tsx:236](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/editar-turma-modal.tsx#L236) |
| `hover:bg-gray-200/60` | 1 | [calendario-aulas.tsx:101](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L101) |
| `hover:bg-gray-200/70` | 2 | [calendario-aulas.tsx:109](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L109) |
| `hover:bg-gray-50` | 11 | [sidebar.tsx:166](../src/app/_components/sidebar.tsx#L166) |
| `hover:bg-gray-50/50` | 1 | [presenca-view.tsx:235](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L235) |
| `hover:bg-orange-100` | 3 | [acoes-monitores.tsx:67](../src/app/nexus/diretoria/monitores/_components/acoes-monitores.tsx#L67) |
| `hover:bg-orange-200` | 1 | [lista-questionarios.tsx:115](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L115) |
| `hover:bg-orange-50` | 3 | [people-management-card.tsx:75](../src/app/_components/diretoria/people-management-card.tsx#L75) |
| `hover:bg-orange-600` | 1 | [modal-importacao-alunos.tsx:222](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L222) |
| `hover:bg-orange-700` | 1 | [painel-sorteador.tsx:328](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L328) |
| `hover:bg-orange-800` | 2 | [project-code-modal.tsx:119](../src/app/_components/diretoria/project-code-modal.tsx#L119) |
| `hover:bg-red-200` | 2 | [lista-alunos.tsx:154](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L154) |
| `hover:bg-red-50` | 15 | [people-management-card.tsx:95](../src/app/_components/diretoria/people-management-card.tsx#L95) |
| `hover:bg-red-700` | 1 | [modal-excluir-questionario.tsx:72](../src/app/nexus/diretoria/questionarios/_components/modal-excluir-questionario.tsx#L72) |
| `hover:bg-red-800` | 1 | [page.tsx:134](../src/app/nexus/diretoria/turmas/page.tsx#L134) |
| `hover:bg-sky-100` | 5 | [card-aviso.tsx:82](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L82) |
| `hover:bg-sky-200` | 3 | [lista-questionarios.tsx:89](../src/app/nexus/diretoria/questionarios/_components/lista-questionarios.tsx#L89) |
| `hover:bg-sky-400` | 1 | [painel-tamanho-texto.tsx:47](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L47) |
| `hover:bg-sky-50` | 20 | [people-management-card.tsx:85](../src/app/_components/diretoria/people-management-card.tsx#L85) |
| `hover:bg-sky-700` | 24 | [force-password-change.tsx:193](../src/app/_components/force-password-change.tsx#L193) |
| `hover:bg-sky-800` | 5 | [sincronizar-presencas-modal.tsx:48](../src/app/_components/diretoria/sincronizar-presencas-modal.tsx#L48) |
| `hover:bg-slate-100` | 20 | [presence-grid.tsx:153](../src/app/_components/diretoria/presence-grid.tsx#L153) |
| `hover:bg-slate-200` | 1 | [formulario-item.tsx:93](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L93) |
| `hover:bg-slate-50` | 6 | [navbar.tsx:140](../src/app/_components/home/navbar.tsx#L140) |
| `hover:bg-violet-200` | 1 | [lista-alunos.tsx:116](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L116) |
| `hover:bg-violet-700` | 1 | [formulario-professor.tsx:139](../src/app/nexus/diretoria/professores/_components/formulario-professor.tsx#L139) |
| `hover:bg-white` | 5 | [acessibilidade-sidebar.tsx:29](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L29) |
| `hover:bg-white/15` | 2 | [acesso-rapido.tsx:17](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L17) |
| `hover:bg-white/20` | 10 | [galeria.tsx:126](../src/app/_components/home/galeria.tsx#L126) |
| `hover:bg-white/25` | 1 | [modal-importacao-alunos.tsx:99](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L99) |
| `hover:bg-white/30` | 1 | [acoes-formulario.tsx:43](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L43) |
| `hover:border-amber-200` | 1 | [modal-vinculo-turmas-em-lote.tsx:109](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L109) |
| `hover:border-gray-200` | 1 | [calendario-aulas.tsx:160](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L160) |
| `hover:border-gray-300` | 10 | [ferramentaCerd.tsx:17](../src/app/_components/ferramentaCerd.tsx#L17) |
| `hover:border-red-200` | 1 | [painel-sorteador.tsx:354](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L354) |
| `hover:border-sky-200` | 1 | [painel-sorteador.tsx:346](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L346) |
| `hover:border-sky-300` | 2 | [theme-option.tsx:18](../src/app/nexus/acessibilidade/_components/theme-option.tsx#L18) |
| `hover:border-sky-500` | 1 | [modal-importacao-alunos.tsx:112](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L112) |
| `hover:brightness-90` | 3 | [confirmacao-presenca-modal.tsx:47](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L47) |
| `hover:brightness-95` | 3 | [presenca-view.tsx:192](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L192) |
| `hover:from-blue-500` | 1 | [canais-atendimento.tsx:106](../src/app/_components/home/_components/canais-atendimento.tsx#L106) |
| `hover:from-purple-500` | 1 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `hover:from-red-500` | 1 | [canais-atendimento.tsx:125](../src/app/_components/home/_components/canais-atendimento.tsx#L125) |
| `hover:opacity-75` | 1 | [navbar.tsx:67](../src/app/_components/home/navbar.tsx#L67) |
| `hover:opacity-80` | 2 | [anotacoes-view.tsx:61](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L61) |
| `hover:shadow-[0_16px_28px_rgba(2,132,199,.28)]` | 2 | [formulario-login.tsx:93](../src/app/nexus/login/_components/formulario-login.tsx#L93) |
| `hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]` | 4 | [people-management-card.tsx:41](../src/app/_components/diretoria/people-management-card.tsx#L41) |
| `hover:shadow-2xl` | 2 | [acesso-nexus.tsx:3](../src/app/_components/home/_components/acesso-nexus.tsx#L3) |
| `hover:shadow-lg` | 4 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `hover:shadow-md` | 5 | [ferramentaCerd.tsx:17](../src/app/_components/ferramentaCerd.tsx#L17) |
| `hover:shadow-sky-900/10` | 1 | [acesso-nexus.tsx:3](../src/app/_components/home/_components/acesso-nexus.tsx#L3) |
| `hover:shadow-sm` | 7 | [stat-mini.tsx:17](../src/app/nexus/diretoria/_components/stat-mini.tsx#L17) |
| `hover:shadow-xs` | 2 | [anotacoes-view.tsx:113](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L113) |
| `hover:text-amber-200` | 1 | [canais-atendimento.tsx:166](../src/app/_components/home/_components/canais-atendimento.tsx#L166) |
| `hover:text-amber-300` | 2 | [canais-atendimento.tsx:33](../src/app/_components/home/_components/canais-atendimento.tsx#L33) |
| `hover:text-amber-500` | 2 | [navbar.tsx:68](../src/app/_components/home/navbar.tsx#L68) |
| `hover:text-amber-600` | 1 | [professor-card.tsx:41](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L41) |
| `hover:text-amber-700` | 1 | [people-management-card.tsx:70](../src/app/_components/diretoria/people-management-card.tsx#L70) |
| `hover:text-blue-600` | 2 | [navbar.tsx:90](../src/app/_components/home/navbar.tsx#L90) |
| `hover:text-blue-700` | 1 | [inicio-view.tsx:130](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/inicio-view.tsx#L130) |
| `hover:text-gray-600` | 9 | [pergunta-editor.tsx:205](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L205) |
| `hover:text-gray-700` | 5 | [botaoVoltar.tsx:14](../src/app/_components/botaoVoltar.tsx#L14) |
| `hover:text-gray-900` | 2 | [sidebar.tsx:166](../src/app/_components/sidebar.tsx#L166) |
| `hover:text-orange-700` | 1 | [people-management-card.tsx:75](../src/app/_components/diretoria/people-management-card.tsx#L75) |
| `hover:text-orange-800` | 1 | [page.tsx:82](../src/app/nexus/diretoria/sorteio/page.tsx#L82) |
| `hover:text-red-400` | 1 | [card-aviso.tsx:61](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L61) |
| `hover:text-red-500` | 7 | [anotacoes-view.tsx:147](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L147) |
| `hover:text-red-600` | 2 | [people-management-card.tsx:95](../src/app/_components/diretoria/people-management-card.tsx#L95) |
| `hover:text-red-800` | 2 | [aulas-editor.tsx:96](../src/app/nexus/diretoria/turmas/_components/aulas-editor.tsx#L96) |
| `hover:text-sky-500` | 1 | [card-aviso.tsx:40](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L40) |
| `hover:text-sky-600` | 3 | [sidebar.tsx:140](../src/app/_components/sidebar.tsx#L140) |
| `hover:text-sky-700` | 7 | [people-management-card.tsx:85](../src/app/_components/diretoria/people-management-card.tsx#L85) |
| `hover:text-sky-800` | 1 | [acessibilidade-sidebar.tsx:102](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L102) |
| `hover:text-sky-900` | 2 | [navegacao-sidebar.tsx:163](../src/app/_components/sidebar/navegacao-sidebar.tsx#L163) |
| `hover:text-sky-950` | 2 | [navegacao-sidebar.tsx:198](../src/app/_components/sidebar/navegacao-sidebar.tsx#L198) |
| `hover:text-slate-700` | 2 | [project-code-modal.tsx:84](../src/app/_components/diretoria/project-code-modal.tsx#L84) |
| `hover:text-white` | 4 | [turmaCard.tsx:91](../src/app/_components/turmaCard.tsx#L91) |
| `hover:to-amber-100` | 1 | [ranking.tsx:154](../src/app/nexus/diretoria/conecta/_components/ranking.tsx#L154) |
| `hover:to-blue-700` | 1 | [canais-atendimento.tsx:106](../src/app/_components/home/_components/canais-atendimento.tsx#L106) |
| `hover:to-orange-500` | 1 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `hover:to-red-700` | 1 | [canais-atendimento.tsx:125](../src/app/_components/home/_components/canais-atendimento.tsx#L125) |
| `hover:via-blue-600` | 1 | [canais-atendimento.tsx:106](../src/app/_components/home/_components/canais-atendimento.tsx#L106) |
| `hover:via-pink-500` | 1 | [canais-atendimento.tsx:85](../src/app/_components/home/_components/canais-atendimento.tsx#L85) |
| `hover:via-red-600` | 1 | [canais-atendimento.tsx:125](../src/app/_components/home/_components/canais-atendimento.tsx#L125) |
| `last:border-0` | 1 | [inscricoes.tsx:164](../src/app/_components/home/inscricoes.tsx#L164) |
| `lg:text-lg` | 1 | [navbar.tsx:74](../src/app/_components/home/navbar.tsx#L74) |
| `max-sm:[&_div[class$=orb]]:opacity-25` | 1 | [page.tsx:32](../src/app/nexus/diretoria/conecta/page.tsx#L32) |
| `md:bg-transparent` | 1 | [galeria.tsx:118](../src/app/_components/home/galeria.tsx#L118) |
| `md:text-3xl` | 1 | [acesso-nexus.tsx:24](../src/app/_components/home/_components/acesso-nexus.tsx#L24) |
| `md:text-4xl` | 7 | [contatos.tsx:54](../src/app/_components/home/contatos.tsx#L54) |
| `md:text-base` | 1 | [acesso-nexus.tsx:31](../src/app/_components/home/_components/acesso-nexus.tsx#L31) |
| `md:text-left` | 1 | [acesso-nexus.tsx:11](../src/app/_components/home/_components/acesso-nexus.tsx#L11) |
| `md:text-xl` | 3 | [inscricoes.tsx:155](../src/app/_components/home/inscricoes.tsx#L155) |
| `mix-blend-overlay` | 1 | [acoes-formulario.tsx:20](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L20) |
| `mix-blend-screen` | 1 | [turmaCard.tsx:72](../src/app/_components/turmaCard.tsx#L72) |
| `opacity-0` | 12 | [acesso-nexus.tsx:44](../src/app/_components/home/_components/acesso-nexus.tsx#L44) |
| `opacity-10` | 2 | [acesso-nexus.tsx:6](../src/app/_components/home/_components/acesso-nexus.tsx#L6) |
| `opacity-100` | 11 | [contatos.tsx:43](../src/app/_components/home/contatos.tsx#L43) |
| `opacity-20` | 4 | [canais-atendimento.tsx:147](../src/app/_components/home/_components/canais-atendimento.tsx#L147) |
| `opacity-60` | 3 | [card-candidato.tsx:23](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L23) |
| `opacity-70` | 1 | [janela-gestao-turma.tsx:120](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L120) |
| `opacity-75` | 1 | [calendario-aulas.tsx:160](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L160) |
| `outline-[3px]` | 1 | [painel-tour.tsx:47](../src/app/_components/screen-tour/painel-tour.tsx#L47) |
| `outline-none` | 49 | [project-code-modal.tsx:110](../src/app/_components/diretoria/project-code-modal.tsx#L110) |
| `outline-orange-400` | 1 | [painel-tour.tsx:47](../src/app/_components/screen-tour/painel-tour.tsx#L47) |
| `peer-disabled:opacity-50` | 1 | [planilhas-presencas.tsx:148](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx#L148) |
| `peer-focus-visible:outline-2` | 1 | [planilhas-presencas.tsx:148](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx#L148) |
| `peer-focus-visible:outline-offset-2` | 1 | [planilhas-presencas.tsx:148](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx#L148) |
| `peer-focus-visible:outline-sky-600` | 1 | [planilhas-presencas.tsx:148](../src/app/nexus/diretoria/presencas/_components/planilhas-presencas.tsx#L148) |
| `placeholder:text-gray-400` | 3 | [acoes-alunos.tsx:61](../src/app/nexus/diretoria/alunos/_components/acoes-alunos.tsx#L61) |
| `placeholder:text-orange-500` | 1 | [modal-importacao-alunos.tsx:190](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L190) |
| `placeholder:text-sky-500` | 1 | [modal-importacao-alunos.tsx:152](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L152) |
| `placeholder:text-slate-400` | 9 | [project-code-modal.tsx:110](../src/app/_components/diretoria/project-code-modal.tsx#L110) |
| `placeholder:text-slate-500` | 1 | [alunos-gestao-turma.tsx:85](../src/app/nexus/diretoria/turmas/_components/alunos-gestao-turma.tsx#L85) |
| `placeholder:text-white/70` | 1 | [janela-gestao-turma.tsx:139](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L139) |
| `ring-1` | 8 | [force-password-change.tsx:86](../src/app/_components/force-password-change.tsx#L86) |
| `ring-2` | 3 | [painel-tamanho-texto.tsx:47](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L47) |
| `ring-4` | 2 | [cabecalho-formulario.tsx:25](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L25) |
| `ring-gray-200` | 4 | [painel-sorteador.tsx:123](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L123) |
| `ring-gray-300` | 1 | [calendario-aulas.tsx:160](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L160) |
| `ring-sky-100` | 2 | [sidebar.tsx:166](../src/app/_components/sidebar.tsx#L166) |
| `ring-sky-200` | 1 | [painel-tamanho-texto.tsx:47](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L47) |
| `ring-sky-50` | 2 | [cabecalho-formulario.tsx:25](../src/app/nexus/diretoria/formularios/_components/cabecalho-formulario.tsx#L25) |
| `ring-white/20` | 1 | [force-password-change.tsx:86](../src/app/_components/force-password-change.tsx#L86) |
| `shadow-[0_-8px_24px_rgba(15,23,42,.05)]` | 1 | [navegacao-turma-desktop.tsx:17](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx#L17) |
| `shadow-[0_10px_20px_rgba(234,88,12,.25)]` | 1 | [page-intro.tsx:19](../src/app/_components/diretoria/page-intro.tsx#L19) |
| `shadow-[0_10px_24px_rgb(2_132_199_/_0.34)]` | 2 | [sidebar.tsx:90](../src/app/_components/sidebar.tsx#L90) |
| `shadow-[0_10px_24px_rgba(15,23,42,.06)]` | 9 | [people-management-card.tsx:41](../src/app/_components/diretoria/people-management-card.tsx#L41) |
| `shadow-[0_10px_24px_rgba(2,132,199,.06)]` | 2 | [data-skeleton.tsx:12](../src/app/_components/diretoria/data-skeleton.tsx#L12) |
| `shadow-[0_12px_22px_rgba(2,132,199,.24)]` | 3 | [formulario-login.tsx:93](../src/app/nexus/login/_components/formulario-login.tsx#L93) |
| `shadow-[0_12px_24px_rgba(234,88,12,.24)]` | 1 | [painel-sorteador.tsx:328](../src/app/nexus/diretoria/sorteio/sorteador/_components/painel-sorteador.tsx#L328) |
| `shadow-[0_12px_24px_rgba(234,88,12,.3)]` | 1 | [apresentacao-login.tsx:35](../src/app/nexus/login/_components/apresentacao-login.tsx#L35) |
| `shadow-[0_12px_27px_rgba(15,23,42,.07)]` | 1 | [turma-dashboard-card.tsx:13](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L13) |
| `shadow-[0_12px_28px_rgba(2,132,199,.28)]` | 1 | [screen-tour.tsx:282](../src/app/_components/screen-tour.tsx#L282) |
| `shadow-[0_12px_30px_rgba(15,23,42,.06)]` | 11 | [presence-grid.tsx:98](../src/app/_components/diretoria/presence-grid.tsx#L98) |
| `shadow-[0_12px_30px_rgba(15,23,42,.07)]` | 2 | [historico-sorteador.tsx:22](../src/app/nexus/diretoria/sorteio/sorteador/_components/historico-sorteador.tsx#L22) |
| `shadow-[0_12px_30px_rgba(15,23,42,0.06)]` | 2 | [filtros-estoque.tsx:25](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L25) |
| `shadow-[0_12px_30px_rgba(15,23,42,0.07)]` | 1 | [card-item.tsx:25](../src/app/nexus/diretoria/estoque/_components/card-item.tsx#L25) |
| `shadow-[0_12px_30px_rgba(15,23,42,0.08)]` | 1 | [formulario-item.tsx:28](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L28) |
| `shadow-[0_12px_30px_rgba(234,88,12,0.08)]` | 1 | [page.tsx:78](../src/app/nexus/diretoria/page.tsx#L78) |
| `shadow-[0_14px_32px_rgb(15_23_42_/_0.2)]` | 1 | [navegacao-turma-mobile.tsx:34](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L34) |
| `shadow-[0_16px_28px_rgba(2,132,199,0.18)]` | 1 | [acesso-rapido.tsx:17](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L17) |
| `shadow-[0_18px_35px_rgba(2,132,199,.2)]` | 1 | [cabecalho-turma.tsx:29](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L29) |
| `shadow-[0_18px_42px_rgba(15,23,42,.1)]` | 1 | [page.tsx:47](../src/app/nexus/redefinir-senha/page.tsx#L47) |
| `shadow-[0_18px_42px_rgba(15,23,42,.12)]` | 2 | [estado-enviado.tsx:26](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L26) |
| `shadow-[0_20px_45px_rgba(2,132,199,.22)]` | 4 | [page.tsx:31](../src/app/nexus/configuracoes/page.tsx#L31) |
| `shadow-[0_20px_45px_rgba(2,132,199,.24)]` | 1 | [page.tsx:72](../src/app/nexus/diretoria/sorteio/sorteador/page.tsx#L72) |
| `shadow-[0_20px_45px_rgba(2,132,199,0.25)]` | 1 | [page.tsx:21](../src/app/nexus/diretoria/page.tsx#L21) |
| `shadow-[0_20px_45px_rgba(3,105,161,.24)]` | 1 | [page.tsx:24](../src/app/nexus/acessibilidade/page.tsx#L24) |
| `shadow-[0_20px_55px_rgba(15,23,42,.14)]` | 1 | [janela-gestao-turma.tsx:114](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L114) |
| `shadow-[0_24px_56px_rgba(2,70,110,.34)]` | 1 | [force-password-change.tsx:75](../src/app/_components/force-password-change.tsx#L75) |
| `shadow-[0_24px_60px_rgba(2,6,23,.32)]` | 1 | [painel-tour.tsx:65](../src/app/_components/screen-tour/painel-tour.tsx#L65) |
| `shadow-[0_24px_70px_rgba(2,132,199,.28)]` | 1 | [modal-importacao-alunos.tsx:71](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L71) |
| `shadow-[0_8px_18px_rgba(2,132,199,.24)]` | 1 | [force-password-change.tsx:193](../src/app/_components/force-password-change.tsx#L193) |
| `shadow-[10px_0_30px_rgba(14,165,233,0.05)]` | 1 | [sidebar.tsx:107](../src/app/_components/sidebar.tsx#L107) |
| `shadow-2xl` | 14 | [project-code-modal.tsx:66](../src/app/_components/diretoria/project-code-modal.tsx#L66) |
| `shadow-2xs` | 1 | [calendario-aulas.tsx:92](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L92) |
| `shadow-gray-900/20` | 1 | [acesso-nexus.tsx:41](../src/app/_components/home/_components/acesso-nexus.tsx#L41) |
| `shadow-lg` | 9 | [acesso-nexus.tsx:41](../src/app/_components/home/_components/acesso-nexus.tsx#L41) |
| `shadow-md` | 6 | [acesso-nexus.tsx:13](../src/app/_components/home/_components/acesso-nexus.tsx#L13) |
| `shadow-none` | 1 | [galeria.tsx:112](../src/app/_components/home/galeria.tsx#L112) |
| `shadow-sky-200` | 5 | [navegacao-sidebar.tsx:198](../src/app/_components/sidebar/navegacao-sidebar.tsx#L198) |
| `shadow-sky-900/5` | 2 | [acesso-nexus.tsx:3](../src/app/_components/home/_components/acesso-nexus.tsx#L3) |
| `shadow-sm` | 46 | [navbar.tsx:57](../src/app/_components/home/navbar.tsx#L57) |
| `shadow-xl` | 8 | [acesso-nexus.tsx:3](../src/app/_components/home/_components/acesso-nexus.tsx#L3) |
| `shadow-xs` | 6 | [anotacoes-view.tsx:74](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L74) |
| `sm:border-6` | 1 | [layout.tsx:32](../src/app/nexus/layout.tsx#L32) |
| `sm:border-amber-600` | 1 | [layout.tsx:32](../src/app/nexus/layout.tsx#L32) |
| `sm:focus:opacity-100` | 1 | [pergunta-editor.tsx:147](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L147) |
| `sm:group-hover:opacity-100` | 3 | [turmaCard.tsx:91](../src/app/_components/turmaCard.tsx#L91) |
| `sm:group-hover/opt:opacity-100` | 1 | [pergunta-editor.tsx:147](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L147) |
| `sm:opacity-0` | 4 | [turmaCard.tsx:91](../src/app/_components/turmaCard.tsx#L91) |
| `sm:shadow-[0_24px_64px_rgba(15,23,42,.14)]` | 1 | [page.tsx:23](../src/app/nexus/login/page.tsx#L23) |
| `sm:text-2xl` | 2 | [sidebar.tsx:125](../src/app/_components/sidebar.tsx#L125) |
| `sm:text-3xl` | 7 | [onde.tsx:78](../src/app/_components/home/onde.tsx#L78) |
| `sm:text-5xl` | 1 | [not-found.tsx:41](../src/app/not-found.tsx#L41) |
| `sm:text-7xl` | 1 | [resultado-sorteio.tsx:30](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L30) |
| `sm:text-base` | 1 | [calendario-aulas.tsx:89](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L89) |
| `sm:text-gray-300` | 2 | [materiais-view.tsx:138](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L138) |
| `sm:text-lg` | 3 | [matriz-presenca-view.tsx:51](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L51) |
| `sm:text-right` | 1 | [inscricoes.tsx:166](../src/app/_components/home/inscricoes.tsx#L166) |
| `sm:text-sm` | 11 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `sm:text-xl` | 1 | [not-found.tsx:44](../src/app/not-found.tsx#L44) |
| `sm:text-xs` | 3 | [presence-grid.tsx:121](../src/app/_components/diretoria/presence-grid.tsx#L121) |
| `text-[10px]` | 14 | [acessibilidade-sidebar.tsx:113](../src/app/_components/sidebar/acessibilidade-sidebar.tsx#L113) |
| `text-[11px]` | 19 | [people-management-card.tsx:58](../src/app/_components/diretoria/people-management-card.tsx#L58) |
| `text-[clamp(0.65rem,1vw,0.8rem)]` | 1 | [acoes-formulario.tsx:31](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L31) |
| `text-[clamp(1.5rem,8vw,1.875rem)]` | 1 | [page.tsx:31](../src/app/nexus/acessibilidade/page.tsx#L31) |
| `text-[clamp(1rem,1.8vw,1.375rem)]` | 1 | [acoes-formulario.tsx:28](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L28) |
| `text-[color:var(--turma-texto)]` | 2 | [controle-card.tsx:75](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L75) |
| `text-[var(--nexus-ink)]` | 32 | [painel-tour.tsx:127](../src/app/_components/screen-tour/painel-tour.tsx#L127) |
| `text-[var(--nexus-muted)]` | 15 | [painel-tour.tsx:108](../src/app/_components/screen-tour/painel-tour.tsx#L108) |
| `text-amber-300` | 3 | [canais-atendimento.tsx:166](../src/app/_components/home/_components/canais-atendimento.tsx#L166) |
| `text-amber-500` | 1 | [card-aviso.tsx:51](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L51) |
| `text-amber-600` | 4 | [modal-vinculo-turmas-em-lote.tsx:115](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L115) |
| `text-amber-700` | 5 | [modal-vinculo-turmas-em-lote.tsx:96](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L96) |
| `text-amber-800` | 12 | [page.tsx:89](../src/app/nexus/configuracoes/page.tsx#L89) |
| `text-amber-900` | 1 | [matriz-presenca-view.tsx:82](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L82) |
| `text-amber-950` | 3 | [modal-vinculo-turmas-em-lote.tsx:95](../src/app/nexus/diretoria/alunos/_components/modal-vinculo-turmas-em-lote.tsx#L95) |
| `text-black` | 6 | [galeria.tsx:85](../src/app/_components/home/galeria.tsx#L85) |
| `text-black/45` | 2 | [card-candidato.tsx:51](../src/app/nexus/diretoria/sorteio/_components/card-candidato.tsx#L51) |
| `text-black/60` | 2 | [modal-candidato.tsx:93](../src/app/nexus/diretoria/sorteio/_components/modal-candidato.tsx#L93) |
| `text-blue-600` | 5 | [navbar.tsx:68](../src/app/_components/home/navbar.tsx#L68) |
| `text-emerald-700` | 6 | [page.tsx:49](../src/app/nexus/diretoria/diretores/page.tsx#L49) |
| `text-emerald-800` | 3 | [lista-alunos.tsx:108](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L108) |
| `text-emerald-900` | 1 | [modal-importacao-alunos.tsx:229](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L229) |
| `text-gray-200` | 1 | [pergunta-editor.tsx:44](../src/app/nexus/diretoria/formularios/_components/pergunta-editor.tsx#L44) |
| `text-gray-300` | 8 | [ferramentaCerd.tsx:29](../src/app/_components/ferramentaCerd.tsx#L29) |
| `text-gray-400` | 86 | [sidebar.tsx:140](../src/app/_components/sidebar.tsx#L140) |
| `text-gray-500` | 53 | [botaoVoltar.tsx:14](../src/app/_components/botaoVoltar.tsx#L14) |
| `text-gray-600` | 22 | [inscricoes.tsx:162](../src/app/_components/home/inscricoes.tsx#L162) |
| `text-gray-700` | 63 | [inscricoes.tsx:165](../src/app/_components/home/inscricoes.tsx#L165) |
| `text-gray-800` | 13 | [inscricoes.tsx:155](../src/app/_components/home/inscricoes.tsx#L155) |
| `text-gray-900` | 29 | [ferramentaCerd.tsx:26](../src/app/_components/ferramentaCerd.tsx#L26) |
| `text-green-700` | 2 | [confirmacao-presenca-modal.tsx:26](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/confirmacao-presenca-modal.tsx#L26) |
| `text-green-800` | 3 | [page.tsx:158](../src/app/nexus/diretoria/formularios/page.tsx#L158) |
| `text-orange-200` | 1 | [apresentacao-login.tsx:47](../src/app/nexus/login/_components/apresentacao-login.tsx#L47) |
| `text-orange-300` | 1 | [page.tsx:64](../src/app/nexus/diretoria/questionarios/%5Bid%5D/page.tsx#L64) |
| `text-orange-500` | 4 | [sidebar.tsx:128](../src/app/_components/sidebar.tsx#L128) |
| `text-orange-600` | 2 | [historico-matriculas-aluno.tsx:16](../src/app/nexus/diretoria/alunos/%5Bid%5D/_components/historico-matriculas-aluno.tsx#L16) |
| `text-orange-700` | 10 | [people-management-card.tsx:46](../src/app/_components/diretoria/people-management-card.tsx#L46) |
| `text-orange-800` | 16 | [people-management-card.tsx:109](../src/app/_components/diretoria/people-management-card.tsx#L109) |
| `text-orange-950` | 2 | [modal-importacao-alunos.tsx:197](../src/app/nexus/diretoria/alunos/_components/modal-importacao-alunos.tsx#L197) |
| `text-red-400` | 2 | [anotacoes-view.tsx:147](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L147) |
| `text-red-500` | 3 | [turmaCard.tsx:108](../src/app/_components/turmaCard.tsx#L108) |
| `text-red-600` | 5 | [botaoSair.tsx:13](../src/app/nexus/configuracoes/botaoSair.tsx#L13) |
| `text-red-700` | 25 | [project-code-modal.tsx:112](../src/app/_components/diretoria/project-code-modal.tsx#L112) |
| `text-red-800` | 4 | [lista-alunos.tsx:154](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L154) |
| `text-red-900` | 2 | [page.tsx:229](../src/app/nexus/diretoria/estoque/page.tsx#L229) |
| `text-sky-100` | 16 | [canais-atendimento.tsx:28](../src/app/_components/home/_components/canais-atendimento.tsx#L28) |
| `text-sky-200` | 3 | [canais-atendimento.tsx:37](../src/app/_components/home/_components/canais-atendimento.tsx#L37) |
| `text-sky-50` | 3 | [force-password-change.tsx:95](../src/app/_components/force-password-change.tsx#L95) |
| `text-sky-500` | 7 | [professor-card.tsx:21](../src/app/nexus/diretoria/professores/_components/professor-card.tsx#L21) |
| `text-sky-600` | 37 | [presence-grid.tsx:159](../src/app/_components/diretoria/presence-grid.tsx#L159) |
| `text-sky-600/50` | 1 | [resultado-sorteio.tsx:18](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L18) |
| `text-sky-600/60` | 1 | [resultado-sorteio.tsx:23](../src/app/nexus/diretoria/sorteio/sorteador/_components/resultado-sorteio.tsx#L23) |
| `text-sky-700` | 45 | [people-management-card.tsx:46](../src/app/_components/diretoria/people-management-card.tsx#L46) |
| `text-sky-800` | 50 | [people-management-card.tsx:109](../src/app/_components/diretoria/people-management-card.tsx#L109) |
| `text-sky-900` | 12 | [pessalGaleria.tsx:23](../src/app/_components/home/pessalGaleria.tsx#L23) |
| `text-sky-950` | 7 | [inscricoes.tsx:95](../src/app/_components/home/inscricoes.tsx#L95) |
| `text-slate-400` | 9 | [people-management-card.tsx:63](../src/app/_components/diretoria/people-management-card.tsx#L63) |
| `text-slate-500` | 60 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `text-slate-600` | 60 | [presence-grid.tsx:106](../src/app/_components/diretoria/presence-grid.tsx#L106) |
| `text-slate-700` | 33 | [force-password-change.tsx:101](../src/app/_components/force-password-change.tsx#L101) |
| `text-slate-800` | 40 | [form-field.tsx:4](../src/app/_components/diretoria/form-field.tsx#L4) |
| `text-slate-900` | 54 | [people-management-card.tsx:51](../src/app/_components/diretoria/people-management-card.tsx#L51) |
| `text-transparent` | 1 | [acesso-nexus.tsx:26](../src/app/_components/home/_components/acesso-nexus.tsx#L26) |
| `text-violet-700` | 1 | [painel-tamanho-texto.tsx:18](../src/app/nexus/acessibilidade/_components/painel-tamanho-texto.tsx#L18) |
| `text-violet-900` | 1 | [lista-alunos.tsx:116](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L116) |
| `text-white` | 124 | [page-intro.tsx:19](../src/app/_components/diretoria/page-intro.tsx#L19) |
| `text-white-950` | 1 | [acesso-rapido.tsx:17](../src/app/nexus/diretoria/_components/acesso-rapido.tsx#L17) |
| `text-white/70` | 1 | [acoes-formulario.tsx:31](../src/app/nexus/diretoria/formularios/_components/acoes-formulario.tsx#L31) |
| `text-white/75` | 2 | [turma-dashboard-card.tsx:40](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L40) |
| `text-white/80` | 6 | [turmaCard.tsx:91](../src/app/_components/turmaCard.tsx#L91) |
| `text-white/85` | 2 | [cabecalho-turma.tsx:77](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L77) |
| `text-white/90` | 1 | [lista-semestres.tsx:49](../src/app/nexus/diretoria/semestres/_components/lista-semestres.tsx#L49) |
| `to-amber-50/20` | 1 | [acesso-nexus.tsx:5](../src/app/_components/home/_components/acesso-nexus.tsx#L5) |
| `to-amber-600` | 1 | [lista-diretores.tsx:26](../src/app/nexus/diretoria/diretores/_components/lista-diretores.tsx#L26) |
| `to-blue-100` | 1 | [ranking.tsx:154](../src/app/nexus/diretoria/conecta/_components/ranking.tsx#L154) |
| `to-gray-200` | 1 | [pessalGaleria.tsx:14](../src/app/_components/home/pessalGaleria.tsx#L14) |
| `to-sky-400` | 1 | [acesso-nexus.tsx:26](../src/app/_components/home/_components/acesso-nexus.tsx#L26) |
| `to-sky-500` | 2 | [acesso-nexus.tsx:44](../src/app/_components/home/_components/acesso-nexus.tsx#L44) |
| `to-sky-600` | 2 | [pessalGaleria.tsx:13](../src/app/_components/home/pessalGaleria.tsx#L13) |
| `to-sky-700` | 1 | [canais-atendimento.tsx:3](../src/app/_components/home/_components/canais-atendimento.tsx#L3) |
| `via-sky-50/40` | 1 | [acesso-nexus.tsx:5](../src/app/_components/home/_components/acesso-nexus.tsx#L5) |
| `xl:text-5xl` | 1 | [apresentacao-login.tsx:38](../src/app/nexus/login/_components/apresentacao-login.tsx#L38) |
| `xl:text-lg` | 1 | [apresentacao-login.tsx:41](../src/app/nexus/login/_components/apresentacao-login.tsx#L41) |

## Declarações de cor e efeitos em CSS

Inclui valores diretos, variáveis, transparências, estados de foco e hover e cores vinculadas ao esquema. Os seletores abaixo preservam o escopo definido no código.

### ranking.module.css

| Linha | Seletor | Declaração |
| --- | --- | --- |
| [CSS:2](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L2) | `.ranking` | `--ranking-fundo: var(--nexus-surface)` |
| [CSS:3](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L3) | `.ranking` | `--ranking-texto: var(--nexus-ink)` |
| [CSS:4](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L4) | `.ranking` | `--ranking-secundario: var(--nexus-muted)` |
| [CSS:5](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L5) | `.ranking` | `--ranking-borda: var(--nexus-line)` |
| [CSS:6](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L6) | `.ranking` | `--ranking-azul: light-dark(#03668e, #7dd3fc)` |
| [CSS:7](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L7) | `.ranking` | `--ranking-laranja: light-dark(#b45309, #fdba74)` |
| [CSS:12](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L12) | `.ranking` | `color: var(--ranking-texto)` |
| [CSS:18](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L18) | `.palco, .painel` | `border: 1px solid var(--ranking-borda)` |
| [CSS:20](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L20) | `.palco, .painel` | `background: var(--ranking-fundo)` |
| [CSS:25](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L25) | `.palco` | `border-top: 4px solid var(--ranking-azul)` |
| [CSS:26](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L26) | `.palco` | `background: radial-gradient( ellipse at top, color-mix(in srgb, #0ea5e9 10%, transparent), transparent 65% ), var(--ranking-fundo)` |
| [CSS:52](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L52) | `.tituloPalco svg` | `color: var(--ranking-laranja)` |
| [CSS:70](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L70) | `.podio` | `border-bottom: 2px solid var(--ranking-borda)` |
| [CSS:85](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L85) | `.podio li[data-lugar="1"]` | `--altura-degrau: var(--degrau-alto)` |
| [CSS:90](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L90) | `.podio li[data-lugar="2"]` | `--altura-degrau: var(--degrau-medio)` |
| [CSS:95](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L95) | `.podio li[data-lugar="3"]` | `--altura-degrau: var(--degrau-baixo)` |
| [CSS:109](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L109) | `.botaoPodio:focus-visible` | `outline: 2px solid var(--ranking-azul)` |
| [CSS:138](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L138) | `.posicaoPodio, .posicaoEquipe` | `border: 1px solid var(--ranking-borda)` |
| [CSS:147](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L147) | `.posicaoPodio` | `border: 2px solid color-mix(in srgb, var(--cor-equipe-inicial) 65%, var(--ranking-texto))` |
| [CSS:159](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L159) | `.total` | `color: var(--ranking-texto)` |
| [CSS:178](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L178) | `.degrau` | `border: 1px solid color-mix(in srgb, var(--ranking-borda) 35%, transparent)` |
| [CSS:179](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L179) | `.degrau` | `border-bottom: 0` |
| [CSS:181](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L181) | `.degrau` | `background: linear-gradient( 120deg, var(--cor-equipe-inicial), var(--cor-equipe-final) )` |
| [CSS:186](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L186) | `.degrau` | `box-shadow: inset 0 5px rgb(255 255 255 / 0.16)` |
| [CSS:197](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L197) | `.painelPodio` | `opacity: 0` |
| [CSS:207](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L207) | `.painelPodio[data-aberto="true"]` | `opacity: 1` |
| [CSS:229](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L229) | `.detalheLider` | `border: 1px solid var(--ranking-borda)` |
| [CSS:231](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L231) | `.detalheLider` | `background: color-mix( in srgb, color-mix(in srgb, var(--cor-equipe-inicial), var(--cor-equipe-final)) var(--ranking-mistura), var(--ranking-fundo) )` |
| [CSS:237](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L237) | `.detalheLider` | `box-shadow: var(--nexus-shadow)` |
| [CSS:281](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L281) | `.cabecalhoPainel::before` | `background: var(--ranking-laranja)` |
| [CSS:287](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L287) | `.cabecalhoPainel > span` | `color: var(--ranking-secundario)` |
| [CSS:300](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L300) | `.equipe` | `border: 1px solid var(--ranking-borda)` |
| [CSS:302](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L302) | `.equipe` | `background: linear-gradient(115deg, var(--cor-equipe-inicial), var(--cor-equipe-final)) top / 100% 0.25rem no-repeat, linear-gradient(115deg, white)` |
| [CSS:336](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L336) | `.dadosEquipe p, .pontuacao dt` | `color: color-mix(in srgb, var(--ranking-texto) 78%, var(--ranking-fundo))` |
| [CSS:350](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L350) | `.pontuacao` | `border-top: 1px solid var(--ranking-borda)` |
| [CSS:362](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L362) | `.regra, .vazio` | `color: var(--ranking-secundario)` |
| [CSS:375](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L375) | `.regra` | `border-top: 1px solid var(--ranking-borda)` |
| [CSS:395](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L395) | `.atividades li:not(:last-child)::before` | `background: var(--ranking-borda)` |
| [CSS:406](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L406) | `.iconeAtividade` | `background: var(--nexus-surface-soft)` |
| [CSS:407](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L407) | `.iconeAtividade` | `color: var(--ranking-azul)` |
| [CSS:419](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L419) | `.metaAtividade` | `color: var(--ranking-secundario)` |
| [CSS:429](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L429) | `.pontosAtividade` | `color: var(--ranking-azul)` |
| [CSS:441](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L441) | `:global(html[data-theme="dark"]) .ranking` | `color-scheme: dark` |
| [CSS:445](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L445) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-fundo: var(--contrast-surface)` |
| [CSS:446](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L446) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-texto: var(--contrast-ink)` |
| [CSS:447](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L447) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-secundario: var(--contrast-ink)` |
| [CSS:448](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L448) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-borda: var(--contrast-border)` |
| [CSS:449](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L449) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-azul: var(--contrast-ink)` |
| [CSS:450](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L450) | `:global(html[data-contrast="high"]) .ranking` | `--ranking-laranja: var(--contrast-ink)` |
| [CSS:455](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L455) | `:global(html[data-contrast="high"]) .palco` | `background: var(--ranking-fundo)` |
| [CSS:459](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L459) | `:global(html[data-contrast="high"]) .iconeAtividade` | `border: 1px solid var(--ranking-borda)` |
| [CSS:460](../src/app/nexus/diretoria/conecta/_components/ranking.module.css#L460) | `:global(html[data-contrast="high"]) .iconeAtividade` | `background: var(--ranking-fundo)` |

### impressao.module.css

| Linha | Seletor | Declaração |
| --- | --- | --- |
| [CSS:2](../src/app/nexus/diretoria/impressao/impressao.module.css#L2) | `.page` | `--surface: #fff` |
| [CSS:3](../src/app/nexus/diretoria/impressao/impressao.module.css#L3) | `.page` | `--surface-soft: #f8fafc` |
| [CSS:4](../src/app/nexus/diretoria/impressao/impressao.module.css#L4) | `.page` | `--ink: #0f172a` |
| [CSS:5](../src/app/nexus/diretoria/impressao/impressao.module.css#L5) | `.page` | `--muted: #475569` |
| [CSS:6](../src/app/nexus/diretoria/impressao/impressao.module.css#L6) | `.page` | `--line: #e2e8f0` |
| [CSS:7](../src/app/nexus/diretoria/impressao/impressao.module.css#L7) | `.page` | `--blue-soft: #e0f2fe` |
| [CSS:8](../src/app/nexus/diretoria/impressao/impressao.module.css#L8) | `.page` | `--blue-ink: #075985` |
| [CSS:9](../src/app/nexus/diretoria/impressao/impressao.module.css#L9) | `.page` | `--orange-soft: #fff7ed` |
| [CSS:10](../src/app/nexus/diretoria/impressao/impressao.module.css#L10) | `.page` | `--orange-ink: #9a3412` |
| [CSS:14](../src/app/nexus/diretoria/impressao/impressao.module.css#L14) | `.page` | `color: var(--ink)` |
| [CSS:28](../src/app/nexus/diretoria/impressao/impressao.module.css#L28) | `.page :is(button, input, select):focus-visible` | `outline: 3px solid #f97316` |
| [CSS:36](../src/app/nexus/diretoria/impressao/impressao.module.css#L36) | `.page button:disabled` | `opacity: 0.55` |
| [CSS:39](../src/app/nexus/diretoria/impressao/impressao.module.css#L39) | `.page ::selection` | `color: var(--blue-ink)` |
| [CSS:40](../src/app/nexus/diretoria/impressao/impressao.module.css#L40) | `.page ::selection` | `background: var(--blue-soft)` |
| [CSS:43](../src/app/nexus/diretoria/impressao/impressao.module.css#L43) | `.page :is(input, select)` | `accent-color: #0284c7` |
| [CSS:44](../src/app/nexus/diretoria/impressao/impressao.module.css#L44) | `.page :is(input, select)` | `caret-color: #0284c7` |
| [CSS:51](../src/app/nexus/diretoria/impressao/impressao.module.css#L51) | `.toolbar` | `background: var(--surface)` |
| [CSS:52](../src/app/nexus/diretoria/impressao/impressao.module.css#L52) | `.toolbar` | `border: 1px solid var(--line)` |
| [CSS:71](../src/app/nexus/diretoria/impressao/impressao.module.css#L71) | `.semester select` | `border: 1px solid var(--line)` |
| [CSS:73](../src/app/nexus/diretoria/impressao/impressao.module.css#L73) | `.semester select` | `background: var(--surface-soft)` |
| [CSS:74](../src/app/nexus/diretoria/impressao/impressao.module.css#L74) | `.semester select` | `color: var(--ink)` |
| [CSS:82](../src/app/nexus/diretoria/impressao/impressao.module.css#L82) | `.search` | `border: 1px solid var(--line)` |
| [CSS:84](../src/app/nexus/diretoria/impressao/impressao.module.css#L84) | `.search` | `background: var(--surface-soft)` |
| [CSS:85](../src/app/nexus/diretoria/impressao/impressao.module.css#L85) | `.search` | `color: var(--muted)` |
| [CSS:95](../src/app/nexus/diretoria/impressao/impressao.module.css#L95) | `.search input` | `background: transparent` |
| [CSS:96](../src/app/nexus/diretoria/impressao/impressao.module.css#L96) | `.search input` | `color: var(--ink)` |
| [CSS:97](../src/app/nexus/diretoria/impressao/impressao.module.css#L97) | `.search input` | `border: 0` |
| [CSS:100](../src/app/nexus/diretoria/impressao/impressao.module.css#L100) | `.search input::placeholder` | `color: var(--muted)` |
| [CSS:101](../src/app/nexus/diretoria/impressao/impressao.module.css#L101) | `.search input::placeholder` | `opacity: 1` |
| [CSS:121](../src/app/nexus/diretoria/impressao/impressao.module.css#L121) | `.primary` | `background: #0369a1` |
| [CSS:122](../src/app/nexus/diretoria/impressao/impressao.module.css#L122) | `.primary` | `color: white` |
| [CSS:123](../src/app/nexus/diretoria/impressao/impressao.module.css#L123) | `.primary` | `border: 1px solid transparent` |
| [CSS:126](../src/app/nexus/diretoria/impressao/impressao.module.css#L126) | `.primary:hover` | `background: #075985` |
| [CSS:129](../src/app/nexus/diretoria/impressao/impressao.module.css#L129) | `.secondary` | `background: var(--surface)` |
| [CSS:130](../src/app/nexus/diretoria/impressao/impressao.module.css#L130) | `.secondary` | `border: 1px solid var(--line)` |
| [CSS:131](../src/app/nexus/diretoria/impressao/impressao.module.css#L131) | `.secondary` | `color: var(--blue-ink)` |
| [CSS:134](../src/app/nexus/diretoria/impressao/impressao.module.css#L134) | `.secondary:hover` | `background: var(--blue-soft)` |
| [CSS:147](../src/app/nexus/diretoria/impressao/impressao.module.css#L147) | `.notice` | `background: var(--blue-soft)` |
| [CSS:148](../src/app/nexus/diretoria/impressao/impressao.module.css#L148) | `.notice` | `color: var(--blue-ink)` |
| [CSS:158](../src/app/nexus/diretoria/impressao/impressao.module.css#L158) | `.week` | `background: var(--surface)` |
| [CSS:159](../src/app/nexus/diretoria/impressao/impressao.module.css#L159) | `.week` | `box-shadow: 0 10px 24px rgb(15 23 42 / 0.06)` |
| [CSS:171](../src/app/nexus/diretoria/impressao/impressao.module.css#L171) | `.weekHeader` | `background: #0284c7` |
| [CSS:172](../src/app/nexus/diretoria/impressao/impressao.module.css#L172) | `.weekHeader` | `color: #fff` |
| [CSS:185](../src/app/nexus/diretoria/impressao/impressao.module.css#L185) | `.weekHeader::after` | `background: #f97316` |
| [CSS:199](../src/app/nexus/diretoria/impressao/impressao.module.css#L199) | `.weekIcon` | `background: #0369a1` |
| [CSS:211](../src/app/nexus/diretoria/impressao/impressao.module.css#L211) | `.weekTitle p` | `color: #fff` |
| [CSS:220](../src/app/nexus/diretoria/impressao/impressao.module.css#L220) | `.lessonCheck` | `background: #0369a1` |
| [CSS:229](../src/app/nexus/diretoria/impressao/impressao.module.css#L229) | `.lessonCheck input` | `accent-color: #f97316` |
| [CSS:243](../src/app/nexus/diretoria/impressao/impressao.module.css#L243) | `.row + .row` | `border-top: 1px solid var(--line)` |
| [CSS:258](../src/app/nexus/diretoria/impressao/impressao.module.css#L258) | `.identity p` | `color: var(--muted)` |
| [CSS:269](../src/app/nexus/diretoria/impressao/impressao.module.css#L269) | `.mobileLabel` | `color: var(--muted)` |
| [CSS:289](../src/app/nexus/diretoria/impressao/impressao.module.css#L289) | `.chip` | `background: var(--blue-soft)` |
| [CSS:290](../src/app/nexus/diretoria/impressao/impressao.module.css#L290) | `.chip` | `color: var(--blue-ink)` |
| [CSS:294](../src/app/nexus/diretoria/impressao/impressao.module.css#L294) | `.unassigned` | `background: var(--orange-soft)` |
| [CSS:295](../src/app/nexus/diretoria/impressao/impressao.module.css#L295) | `.unassigned` | `color: var(--orange-ink)` |
| [CSS:315](../src/app/nexus/diretoria/impressao/impressao.module.css#L315) | `.quantity strong span` | `color: var(--muted)` |
| [CSS:323](../src/app/nexus/diretoria/impressao/impressao.module.css#L323) | `.quantityStatus` | `color: var(--muted)` |
| [CSS:340](../src/app/nexus/diretoria/impressao/impressao.module.css#L340) | `.statusButton` | `border: 1px solid var(--line)` |
| [CSS:341](../src/app/nexus/diretoria/impressao/impressao.module.css#L341) | `.statusButton` | `background: var(--surface-soft)` |
| [CSS:342](../src/app/nexus/diretoria/impressao/impressao.module.css#L342) | `.statusButton` | `color: var(--muted)` |
| [CSS:347](../src/app/nexus/diretoria/impressao/impressao.module.css#L347) | `.statusButton:hover` | `border-color: #0284c7` |
| [CSS:350](../src/app/nexus/diretoria/impressao/impressao.module.css#L350) | `.statusButton[data-checked="true"]` | `border-color: transparent` |
| [CSS:351](../src/app/nexus/diretoria/impressao/impressao.module.css#L351) | `.statusButton[data-checked="true"]` | `background: var(--blue-soft)` |
| [CSS:352](../src/app/nexus/diretoria/impressao/impressao.module.css#L352) | `.statusButton[data-checked="true"]` | `color: var(--blue-ink)` |
| [CSS:365](../src/app/nexus/diretoria/impressao/impressao.module.css#L365) | `.rowActions` | `border-top: 1px solid var(--line)` |
| [CSS:381](../src/app/nexus/diretoria/impressao/impressao.module.css#L381) | `.edit` | `background: var(--blue-soft)` |
| [CSS:382](../src/app/nexus/diretoria/impressao/impressao.module.css#L382) | `.edit` | `color: var(--blue-ink)` |
| [CSS:385](../src/app/nexus/diretoria/impressao/impressao.module.css#L385) | `.remove` | `color: #b91c1c` |
| [CSS:386](../src/app/nexus/diretoria/impressao/impressao.module.css#L386) | `.remove` | `background: transparent` |
| [CSS:390](../src/app/nexus/diretoria/impressao/impressao.module.css#L390) | `.remove:hover` | `background: #fef2f2` |
| [CSS:397](../src/app/nexus/diretoria/impressao/impressao.module.css#L397) | `.empty` | `background: var(--surface)` |
| [CSS:398](../src/app/nexus/diretoria/impressao/impressao.module.css#L398) | `.empty` | `border: 1px dashed var(--line)` |
| [CSS:404](../src/app/nexus/diretoria/impressao/impressao.module.css#L404) | `.empty svg` | `color: #0284c7` |
| [CSS:413](../src/app/nexus/diretoria/impressao/impressao.module.css#L413) | `.empty p` | `color: var(--muted)` |
| [CSS:418](../src/app/nexus/diretoria/impressao/impressao.module.css#L418) | `.weekEmpty` | `color: var(--muted)` |
| [CSS:423](../src/app/nexus/diretoria/impressao/impressao.module.css#L423) | `.editor` | `border: 1px solid var(--line)` |
| [CSS:426](../src/app/nexus/diretoria/impressao/impressao.module.css#L426) | `.editor` | `background: var(--surface)` |
| [CSS:439](../src/app/nexus/diretoria/impressao/impressao.module.css#L439) | `.editorFields label` | `color: var(--ink)` |
| [CSS:452](../src/app/nexus/diretoria/impressao/impressao.module.css#L452) | `.editorFields input` | `border: 1px solid var(--line)` |
| [CSS:453](../src/app/nexus/diretoria/impressao/impressao.module.css#L453) | `.editorFields input` | `color: var(--ink)` |
| [CSS:454](../src/app/nexus/diretoria/impressao/impressao.module.css#L454) | `.editorFields input` | `background: var(--surface-soft)` |
| [CSS:497](../src/app/nexus/diretoria/impressao/impressao.module.css#L497) | `@container print-workspace (min-width: 520px) › .rowActions` | `border: 0` |
| [CSS:521](../src/app/nexus/diretoria/impressao/impressao.module.css#L521) | `@container print-workspace (min-width: 940px) › .columns` | `background: var(--surface-soft)` |
| [CSS:522](../src/app/nexus/diretoria/impressao/impressao.module.css#L522) | `@container print-workspace (min-width: 940px) › .columns` | `color: var(--muted)` |
| [CSS:526](../src/app/nexus/diretoria/impressao/impressao.module.css#L526) | `@container print-workspace (min-width: 940px) › .columns` | `border-bottom: 1px solid var(--line)` |
| [CSS:556](../src/app/nexus/diretoria/impressao/impressao.module.css#L556) | `:global(html[data-theme="dark"]) .page` | `--surface: #162033` |
| [CSS:557](../src/app/nexus/diretoria/impressao/impressao.module.css#L557) | `:global(html[data-theme="dark"]) .page` | `--surface-soft: #101a2b` |
| [CSS:558](../src/app/nexus/diretoria/impressao/impressao.module.css#L558) | `:global(html[data-theme="dark"]) .page` | `--ink: #e5edf8` |
| [CSS:559](../src/app/nexus/diretoria/impressao/impressao.module.css#L559) | `:global(html[data-theme="dark"]) .page` | `--muted: #bacadd` |
| [CSS:560](../src/app/nexus/diretoria/impressao/impressao.module.css#L560) | `:global(html[data-theme="dark"]) .page` | `--line: #42546d` |
| [CSS:561](../src/app/nexus/diretoria/impressao/impressao.module.css#L561) | `:global(html[data-theme="dark"]) .page` | `--blue-soft: #183b56` |
| [CSS:562](../src/app/nexus/diretoria/impressao/impressao.module.css#L562) | `:global(html[data-theme="dark"]) .page` | `--blue-ink: #dbe7f5` |
| [CSS:563](../src/app/nexus/diretoria/impressao/impressao.module.css#L563) | `:global(html[data-theme="dark"]) .page` | `--orange-soft: #42291b` |
| [CSS:564](../src/app/nexus/diretoria/impressao/impressao.module.css#L564) | `:global(html[data-theme="dark"]) .page` | `--orange-ink: #fed7aa` |
| [CSS:567](../src/app/nexus/diretoria/impressao/impressao.module.css#L567) | `:global(html[data-theme="dark"]) .remove` | `color: #fca5a5` |
| [CSS:570](../src/app/nexus/diretoria/impressao/impressao.module.css#L570) | `:global(html[data-theme="dark"]) .remove:hover` | `background: #452329` |
| [CSS:573](../src/app/nexus/diretoria/impressao/impressao.module.css#L573) | `:global(html[data-contrast="high"]) .page` | `--line: currentColor` |

### materiais.module.css

| Linha | Seletor | Declaração |
| --- | --- | --- |
| [CSS:2](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L2) | `.page` | `--surface: #fff` |
| [CSS:3](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L3) | `.page` | `--surface-soft: #f8fafc` |
| [CSS:4](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L4) | `.page` | `--ink: #0f172a` |
| [CSS:5](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L5) | `.page` | `--muted: #475569` |
| [CSS:6](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L6) | `.page` | `--line: #e2e8f0` |
| [CSS:7](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L7) | `.page` | `--blue-soft: #e0f2fe` |
| [CSS:8](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L8) | `.page` | `--blue-ink: #075985` |
| [CSS:9](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L9) | `.page` | `--orange-soft: #fff7ed` |
| [CSS:10](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L10) | `.page` | `--orange-ink: #9a3412` |
| [CSS:14](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L14) | `.page` | `color: var(--ink)` |
| [CSS:26](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L26) | `.page :is(button, input, select):focus-visible, .editor:focus-visible` | `outline: 3px solid #f97316` |
| [CSS:30](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L30) | `.page ::selection` | `background: var(--blue-soft)` |
| [CSS:31](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L31) | `.page ::selection` | `color: var(--blue-ink)` |
| [CSS:34](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L34) | `.page :is(input, select)` | `accent-color: #0284c7` |
| [CSS:35](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L35) | `.page :is(input, select)` | `caret-color: #0284c7` |
| [CSS:41](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L41) | `.page button:disabled` | `opacity: 0.55` |
| [CSS:51](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L51) | `.toolbar` | `border: 1px solid var(--line)` |
| [CSS:53](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L53) | `.toolbar` | `background: var(--surface)` |
| [CSS:69](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L69) | `.semester select` | `border: 1px solid var(--line)` |
| [CSS:71](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L71) | `.semester select` | `background: var(--surface-soft)` |
| [CSS:72](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L72) | `.semester select` | `color: var(--ink)` |
| [CSS:89](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L89) | `.primary` | `color: #fff` |
| [CSS:90](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L90) | `.primary` | `background: #0369a1` |
| [CSS:93](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L93) | `.primary:hover` | `background: #075985` |
| [CSS:96](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L96) | `.secondary` | `color: var(--blue-ink)` |
| [CSS:97](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L97) | `.secondary` | `background: var(--surface)` |
| [CSS:98](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L98) | `.secondary` | `border: 1px solid var(--line)` |
| [CSS:102](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L102) | `.secondary:hover, .edit` | `background: var(--blue-soft)` |
| [CSS:103](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L103) | `.secondary:hover, .edit` | `color: var(--blue-ink)` |
| [CSS:106](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L106) | `.edit:hover` | `outline: 1px solid var(--blue-ink)` |
| [CSS:110](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L110) | `.remove` | `color: #b91c1c` |
| [CSS:111](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L111) | `.remove` | `background: transparent` |
| [CSS:114](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L114) | `.remove:hover` | `background: #fef2f2` |
| [CSS:119](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L119) | `.notice` | `background: var(--blue-soft)` |
| [CSS:120](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L120) | `.notice` | `color: var(--blue-ink)` |
| [CSS:134](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L134) | `.card` | `background: var(--surface)` |
| [CSS:135](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L135) | `.card` | `box-shadow: 0 10px 24px rgb(15 23 42 / 0.06)` |
| [CSS:142](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L142) | `.cardHeader` | `border-bottom: 1px solid var(--line)` |
| [CSS:151](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L151) | `.materialIcon` | `color: var(--blue-ink)` |
| [CSS:152](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L152) | `.materialIcon` | `background: var(--blue-soft)` |
| [CSS:168](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L168) | `.identity p` | `color: var(--muted)` |
| [CSS:184](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L184) | `.label` | `color: var(--muted)` |
| [CSS:206](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L206) | `.chip` | `background: var(--blue-soft)` |
| [CSS:207](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L207) | `.chip` | `color: var(--blue-ink)` |
| [CSS:210](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L210) | `.unassigned` | `background: var(--orange-soft)` |
| [CSS:211](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L211) | `.unassigned` | `color: var(--orange-ink)` |
| [CSS:238](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L238) | `.statusRow + .statusRow` | `border-top: 1px solid var(--line)` |
| [CSS:251](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L251) | `.statusValue` | `background: var(--surface-soft)` |
| [CSS:252](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L252) | `.statusValue` | `color: var(--muted)` |
| [CSS:257](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L257) | `.statusValue[data-active="true"]` | `color: var(--blue-ink)` |
| [CSS:258](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L258) | `.statusValue[data-active="true"]` | `background: var(--blue-soft)` |
| [CSS:261](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L261) | `.statusValue[data-active="true"][data-tone="orange"]` | `color: var(--orange-ink)` |
| [CSS:262](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L262) | `.statusValue[data-active="true"][data-tone="orange"]` | `background: var(--orange-soft)` |
| [CSS:271](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L271) | `.cardActions` | `border-top: 1px solid var(--line)` |
| [CSS:277](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L277) | `.empty` | `border: 1px dashed var(--line)` |
| [CSS:279](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L279) | `.empty` | `background: var(--surface)` |
| [CSS:286](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L286) | `.empty p` | `color: var(--muted)` |
| [CSS:293](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L293) | `.editor` | `border: 1px solid var(--line)` |
| [CSS:295](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L295) | `.editor` | `background: var(--surface)` |
| [CSS:321](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L321) | `.editorFields input` | `border: 1px solid var(--line)` |
| [CSS:323](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L323) | `.editorFields input` | `background: var(--surface-soft)` |
| [CSS:324](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L324) | `.editorFields input` | `color: var(--ink)` |
| [CSS:360](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L360) | `:global(html[data-theme="dark"]) .page` | `--surface: #162033` |
| [CSS:361](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L361) | `:global(html[data-theme="dark"]) .page` | `--surface-soft: #101a2b` |
| [CSS:362](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L362) | `:global(html[data-theme="dark"]) .page` | `--ink: #e5edf8` |
| [CSS:363](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L363) | `:global(html[data-theme="dark"]) .page` | `--muted: #bacadd` |
| [CSS:364](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L364) | `:global(html[data-theme="dark"]) .page` | `--line: #42546d` |
| [CSS:365](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L365) | `:global(html[data-theme="dark"]) .page` | `--blue-soft: #183b56` |
| [CSS:366](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L366) | `:global(html[data-theme="dark"]) .page` | `--blue-ink: #dbe7f5` |
| [CSS:367](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L367) | `:global(html[data-theme="dark"]) .page` | `--orange-soft: #42291b` |
| [CSS:368](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L368) | `:global(html[data-theme="dark"]) .page` | `--orange-ink: #fed7aa` |
| [CSS:371](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L371) | `:global(html[data-theme="dark"]) .remove` | `color: #fca5a5` |
| [CSS:374](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L374) | `:global(html[data-theme="dark"]) .remove:hover` | `background: #452329` |
| [CSS:377](../src/app/nexus/diretoria/materiais-atualizacao/materiais.module.css#L377) | `:global(html[data-contrast="high"]) .page` | `--line: currentColor` |

### globals.css

| Linha | Seletor | Declaração |
| --- | --- | --- |
| [CSS:10](../src/styles/globals.css#L10) | `html[data-theme="light"]` | `--nexus-canvas: #f8fafc` |
| [CSS:11](../src/styles/globals.css#L11) | `html[data-theme="light"]` | `--nexus-surface: #ffffff` |
| [CSS:12](../src/styles/globals.css#L12) | `html[data-theme="light"]` | `--nexus-surface-soft: #f1f5f9` |
| [CSS:13](../src/styles/globals.css#L13) | `html[data-theme="light"]` | `--nexus-ink: #0f172a` |
| [CSS:14](../src/styles/globals.css#L14) | `html[data-theme="light"]` | `--nexus-muted: #64748b` |
| [CSS:15](../src/styles/globals.css#L15) | `html[data-theme="light"]` | `--nexus-line: #cbd5e1` |
| [CSS:16](../src/styles/globals.css#L16) | `html[data-theme="light"]` | `--nexus-hover: #e2e8f0` |
| [CSS:17](../src/styles/globals.css#L17) | `html[data-theme="light"]` | `--nexus-shadow: 0 12px 28px rgb(15 23 42 / 0.08)` |
| [CSS:21](../src/styles/globals.css#L21) | `html[data-theme="dark"]` | `--nexus-canvas: #0b1220` |
| [CSS:22](../src/styles/globals.css#L22) | `html[data-theme="dark"]` | `--nexus-surface: #162033` |
| [CSS:23](../src/styles/globals.css#L23) | `html[data-theme="dark"]` | `--nexus-surface-soft: #1e2b40` |
| [CSS:24](../src/styles/globals.css#L24) | `html[data-theme="dark"]` | `--nexus-ink: #dbe7f5` |
| [CSS:25](../src/styles/globals.css#L25) | `html[data-theme="dark"]` | `--nexus-muted: #bacadd` |
| [CSS:26](../src/styles/globals.css#L26) | `html[data-theme="dark"]` | `--nexus-line: #42546d` |
| [CSS:27](../src/styles/globals.css#L27) | `html[data-theme="dark"]` | `--nexus-hover: #2b3b54` |
| [CSS:28](../src/styles/globals.css#L28) | `html[data-theme="dark"]` | `--nexus-shadow: 0 12px 28px rgb(148 163 184 / 0.16)` |
| [CSS:33](../src/styles/globals.css#L33) | `.turma-tema :is(.text-sky-600, .text-sky-700, .text-blue-600, .text-blue-700)` | `color: var(--turma-destaque) !important` |
| [CSS:36](../src/styles/globals.css#L36) | `.turma-tema :is(.bg-sky-600, .bg-blue-600)` | `background-color: var(--turma-destaque) !important` |
| [CSS:37](../src/styles/globals.css#L37) | `.turma-tema :is(.bg-sky-600, .bg-blue-600)` | `color: var(--turma-destaque-text, #fff) !important` |
| [CSS:40](../src/styles/globals.css#L40) | `.turma-tema :is(.border-sky-200, .border-sky-300)` | `border-color: color-mix(in srgb, var(--turma-destaque) 35%, white) !important` |
| [CSS:43](../src/styles/globals.css#L43) | `.turma-tema :is(.bg-sky-50, .bg-blue-50)` | `background-color: color-mix( in srgb, var(--turma-destaque) 10%, white ) !important` |
| [CSS:59](../src/styles/globals.css#L59) | `@keyframes terminal-cursor › 0%, 45%` | `opacity: 1` |
| [CSS:63](../src/styles/globals.css#L63) | `@keyframes terminal-cursor › 46%, 100%` | `opacity: 0` |
| [CSS:73](../src/styles/globals.css#L73) | `html[data-theme="dark"] .sidebar-user-name` | `color: #e0f2fe !important` |
| [CSS:77](../src/styles/globals.css#L77) | `html[data-theme="light"]` | `color-scheme: light` |
| [CSS:78](../src/styles/globals.css#L78) | `html[data-theme="light"]` | `background: #f8fafc` |
| [CSS:81](../src/styles/globals.css#L81) | `html[data-theme="light"] body` | `background: #f8fafc` |
| [CSS:85](../src/styles/globals.css#L85) | `html[data-theme="dark"] .sidebar-user-name .terminal-cursor` | `color: #fbbf24 !important` |
| [CSS:91](../src/styles/globals.css#L91) | `html[data-theme="dark"] .nexus-sidebar` | `background-color: #0f172a !important` |
| [CSS:92](../src/styles/globals.css#L92) | `html[data-theme="dark"] .nexus-sidebar` | `border-color: #334155 !important` |
| [CSS:93](../src/styles/globals.css#L93) | `html[data-theme="dark"] .nexus-sidebar` | `box-shadow: 10px 0 30px rgb(2 6 23 / 0.38) !important` |
| [CSS:96](../src/styles/globals.css#L96) | `html[data-theme="dark"] .nexus-sidebar :is(.border-sky-100, .border-gray-200)` | `border-color: #334155 !important` |
| [CSS:99](../src/styles/globals.css#L99) | `html[data-theme="dark"] .nexus-sidebar .bg-sky-50:not([class*="dark:"])` | `background-color: #0c4a6e !important` |
| [CSS:100](../src/styles/globals.css#L100) | `html[data-theme="dark"] .nexus-sidebar .bg-sky-50:not([class*="dark:"])` | `color: #e0f2fe !important` |
| [CSS:103](../src/styles/globals.css#L103) | `html[data-theme="dark"] .nexus-sidebar [class*="bg-sky-50/"]:not([class*="dark:"])` | `background-color: #172554 !important` |
| [CSS:106](../src/styles/globals.css#L106) | `html[data-theme="dark"] .nexus-sidebar :is(.hover\:bg-white:hover, .hover\:bg-gray-50:hover, .hover\:bg-sky-50:hover):not([class*="dark:"])` | `background-color: #1e3a5f !important` |
| [CSS:111](../src/styles/globals.css#L111) | `html[data-theme="dark"] .aluno-card-action-info` | `background-color: rgb(76 29 149 / 0.72) !important` |
| [CSS:112](../src/styles/globals.css#L112) | `html[data-theme="dark"] .aluno-card-action-info` | `color: #ddd6fe !important` |
| [CSS:115](../src/styles/globals.css#L115) | `html[data-theme="dark"] .aluno-card-action-info:hover` | `background-color: rgb(91 33 182 / 0.82) !important` |
| [CSS:118](../src/styles/globals.css#L118) | `html[data-theme="dark"] .aluno-card-action-delete` | `background-color: rgb(127 29 29 / 0.72) !important` |
| [CSS:119](../src/styles/globals.css#L119) | `html[data-theme="dark"] .aluno-card-action-delete` | `color: #fecaca !important` |
| [CSS:122](../src/styles/globals.css#L122) | `html[data-theme="dark"] .aluno-card-action-delete:hover` | `background-color: rgb(153 27 27 / 0.82) !important` |
| [CSS:134](../src/styles/globals.css#L134) | `html[data-theme="dark"] :is(.bg-white, .bg-white\/95):not([class*="dark:"])` | `background-color: var(--nexus-surface) !important` |
| [CSS:137](../src/styles/globals.css#L137) | `html[data-theme="dark"] :is(.bg-slate-50, .bg-gray-50):not([class*="dark:"])` | `background-color: var(--nexus-canvas) !important` |
| [CSS:141](../src/styles/globals.css#L141) | `html[data-theme="dark"] .nexus-dashboard` | `background: radial-gradient(circle at 95% 0%, rgb(14 165 233 / 0.14), transparent 25rem), radial-gradient( circle at 76% 12rem, rgb(249 115 22 / 0.1), transparent 19rem ), #0b1220 !important` |
| [CSS:163](../src/styles/globals.css#L163) | `html[data-theme="dark"] :is( .bg-slate-100, .bg-gray-100, .bg-sky-50, .bg-sky-100, .bg-orange-50, .bg-orange-100, .bg-amber-50, .bg-amber-100, .bg-emerald-50, .bg-green-50 ):not([class*="dark:"])` | `background-color: var(--nexus-surface-soft) !important` |
| [CSS:173](../src/styles/globals.css#L173) | `html[data-theme="dark"] :is( [class*="bg-sky-50/"], [class*="bg-gray-50/"], [class*="bg-slate-50/"] ):not([class*="dark:"])` | `background-color: var(--nexus-surface-soft) !important` |
| [CSS:189](../src/styles/globals.css#L189) | `html[data-theme="dark"] :is( .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600, .text-slate-500, .text-sky-800 ):not([class*="dark:"])` | `color: var(--nexus-ink) !important` |
| [CSS:202](../src/styles/globals.css#L202) | `html[data-theme="dark"] :is( .border-gray-100, .border-gray-200, .border-gray-300, .border-slate-100, .border-slate-200, .border-slate-300, .border-sky-100, .border-sky-200 ):not([class*="dark:"])` | `border-color: var(--nexus-line) !important` |
| [CSS:206](../src/styles/globals.css#L206) | `html[data-theme="dark"] :is([class*="shadow-"], .shadow-sm, .shadow-md, .shadow-lg):not([class*="dark:"])` | `box-shadow: var(--nexus-shadow) !important` |
| [CSS:216](../src/styles/globals.css#L216) | `html[data-theme="dark"] :is( .hover\:bg-white:hover, .hover\:bg-gray-100:hover, .hover\:bg-gray-50:hover, .hover\:bg-sky-50:hover, .hover\:bg-orange-50:hover ):not([class*="dark:"])` | `background-color: var(--nexus-hover) !important` |
| [CSS:224](../src/styles/globals.css#L224) | `html[data-theme="dark"] :is( .hover\:text-gray-900:hover, .hover\:text-sky-800:hover, .hover\:text-orange-700:hover ):not([class*="dark:"])` | `color: #f8fafc !important` |
| [CSS:227](../src/styles/globals.css#L227) | `html[data-theme="dark"] .diretoria-workspace` | `background: radial-gradient(circle at 94% 0%, rgb(14 165 233 / 0.17), transparent 21rem), radial-gradient( circle at 73% 12rem, rgb(249 115 22 / 0.12), transparent 18rem ), #0b1220 !important` |
| [CSS:237](../src/styles/globals.css#L237) | `html[data-theme="dark"] .diretoria-workspace__bar` | `background: rgb(15 23 42 / 0.94) !important` |
| [CSS:238](../src/styles/globals.css#L238) | `html[data-theme="dark"] .diretoria-workspace__bar` | `border-color: rgb(71 85 105 / 0.9) !important` |
| [CSS:241](../src/styles/globals.css#L241) | `html[data-theme="dark"] .diretoria-workspace__crumb` | `color: #e0f2fe` |
| [CSS:244](../src/styles/globals.css#L244) | `html[data-theme="dark"] .diretoria-workspace__crumb svg` | `color: #fbbf24` |
| [CSS:247](../src/styles/globals.css#L247) | `html[data-theme="dark"] .diretoria-workspace__search` | `background: #162033` |
| [CSS:248](../src/styles/globals.css#L248) | `html[data-theme="dark"] .diretoria-workspace__search` | `border-color: #42546d` |
| [CSS:249](../src/styles/globals.css#L249) | `html[data-theme="dark"] .diretoria-workspace__search` | `color: #dbe7f5` |
| [CSS:252](../src/styles/globals.css#L252) | `html[data-theme="dark"] .diretoria-workspace__search kbd` | `background: #27364d` |
| [CSS:253](../src/styles/globals.css#L253) | `html[data-theme="dark"] .diretoria-workspace__search kbd` | `color: #dbe7f5` |
| [CSS:256](../src/styles/globals.css#L256) | `html[data-theme="dark"] .diretoria-workspace__semester` | `background: #123a59` |
| [CSS:257](../src/styles/globals.css#L257) | `html[data-theme="dark"] .diretoria-workspace__semester` | `color: #d7f1ff` |
| [CSS:276](../src/styles/globals.css#L276) | `html[data-contrast="high"] :is( .bg-white, .bg-white\/95, .bg-slate-50, .bg-slate-100, .bg-gray-50, .bg-gray-100, .bg-sky-50, .bg-sky-100, .bg-orange-50, .bg-orange-100, .bg-amber-50, .bg-amber-100, .bg-emerald-50, .bg-green-50 )` | `background-color: var(--contrast-surface) !important` |
| [CSS:279](../src/styles/globals.css#L279) | `html[data-contrast="high"] [class*="bg-sky-50/"]` | `background-color: var(--contrast-surface) !important` |
| [CSS:299](../src/styles/globals.css#L299) | `html[data-contrast="high"] :is( .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600, .text-slate-500, .text-slate-400, .text-sky-800, .text-sky-700, .text-sky-600 )` | `color: var(--contrast-ink) !important` |
| [CSS:303](../src/styles/globals.css#L303) | `html[data-contrast="high"] :is([class*="border-"], input, select, textarea, button, a)` | `border-color: var(--contrast-border) !important` |
| [CSS:307](../src/styles/globals.css#L307) | `html[data-contrast="high"] :is([class*="shadow-"], .shadow-sm, .shadow-md, .shadow-lg)` | `box-shadow: none !important` |
| [CSS:310](../src/styles/globals.css#L310) | `html[data-contrast="high"] .diretoria-workspace` | `background: var(--contrast-surface) !important` |
| [CSS:313](../src/styles/globals.css#L313) | `html[data-contrast="high"] .diretoria-workspace__bar` | `background: var(--contrast-surface) !important` |
| [CSS:314](../src/styles/globals.css#L314) | `html[data-contrast="high"] .diretoria-workspace__bar` | `border-color: var(--contrast-border) !important` |
| [CSS:318](../src/styles/globals.css#L318) | `html[data-contrast="high"] .diretoria-workspace__crumb, html[data-contrast="high"] .diretoria-workspace__crumb svg` | `color: var(--contrast-ink)` |
| [CSS:326](../src/styles/globals.css#L326) | `@layer base › html[data-theme="dark"]` | `color-scheme: dark` |
| [CSS:327](../src/styles/globals.css#L327) | `@layer base › html[data-theme="dark"]` | `background: #0b1220` |
| [CSS:330](../src/styles/globals.css#L330) | `@layer base › html[data-theme="dark"] body` | `background: #0b1220` |
| [CSS:331](../src/styles/globals.css#L331) | `@layer base › html[data-theme="dark"] body` | `color: #e5edf8` |
| [CSS:334](../src/styles/globals.css#L334) | `@layer base › html[data-theme="dark"] :is(.diretoria-workspace, .diretoria-workspace__bar)` | `background-color: #101a2b` |
| [CSS:335](../src/styles/globals.css#L335) | `@layer base › html[data-theme="dark"] :is(.diretoria-workspace, .diretoria-workspace__bar)` | `background-image: none` |
| [CSS:338](../src/styles/globals.css#L338) | `@layer base › html[data-theme="dark"] .mix-blend-multiply` | `mix-blend-mode: normal` |
| [CSS:341](../src/styles/globals.css#L341) | `@layer base › html[data-contrast="high"]` | `--contrast-surface: #fff` |
| [CSS:342](../src/styles/globals.css#L342) | `@layer base › html[data-contrast="high"]` | `--contrast-ink: #000` |
| [CSS:343](../src/styles/globals.css#L343) | `@layer base › html[data-contrast="high"]` | `--contrast-border: #000` |
| [CSS:346](../src/styles/globals.css#L346) | `@layer base › html[data-contrast="high"][data-theme="dark"]` | `--contrast-surface: #000` |
| [CSS:347](../src/styles/globals.css#L347) | `@layer base › html[data-contrast="high"][data-theme="dark"]` | `--contrast-ink: #fff` |
| [CSS:348](../src/styles/globals.css#L348) | `@layer base › html[data-contrast="high"][data-theme="dark"]` | `--contrast-border: #fff` |
| [CSS:367](../src/styles/globals.css#L367) | `@layer base › html[data-contrast="high"] :is( .bg-white, .bg-white\/95, .bg-slate-50, .bg-slate-100, .bg-gray-50, .bg-gray-100, .bg-sky-50, .bg-sky-100, .bg-orange-50, .bg-orange-100, .bg-amber-50, .bg-amber-100, .bg-emerald-50, .bg-green-50 )` | `background-color: var(--contrast-surface) !important` |
| [CSS:387](../src/styles/globals.css#L387) | `@layer base › html[data-contrast="high"] :is( .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600, .text-slate-500, .text-slate-400, .text-sky-800, .text-sky-700, .text-sky-600 )` | `color: var(--contrast-ink) !important` |
| [CSS:391](../src/styles/globals.css#L391) | `@layer base › html[data-contrast="high"] :is([class*="border-"], input, select, textarea, button, a)` | `border-color: var(--contrast-border) !important` |
| [CSS:394](../src/styles/globals.css#L394) | `@layer base › html[data-contrast="high"] :is(.shadow-sm, .shadow-md, .shadow-lg)` | `box-shadow: none !important` |
| [CSS:397](../src/styles/globals.css#L397) | `@layer base › html[data-contrast="high"] :focus-visible` | `outline: 4px solid var(--contrast-ink)` |
| [CSS:401](../src/styles/globals.css#L401) | `@layer base › ::selection` | `background: #fed7aa` |
| [CSS:402](../src/styles/globals.css#L402) | `@layer base › ::selection` | `color: #0c4a6e` |
| [CSS:405](../src/styles/globals.css#L405) | `@layer base › :focus-visible` | `outline: 3px solid #f97316` |
| [CSS:412](../src/styles/globals.css#L412) | `.turma-tema__conteudo` | `color: var(--turma-texto, #0f172a) !important` |
| [CSS:429](../src/styles/globals.css#L429) | `.turma-tema__conteudo :is( .text-slate-500, .text-slate-600, .text-slate-700, .text-slate-800, .text-slate-900, .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700, .text-gray-800, .text-gray-900 )` | `color: var(--turma-texto, #0f172a) !important` |
| [CSS:459](../src/styles/globals.css#L459) | `html[data-theme="dark"] .turma-card-tema :is( .text-slate-500, .text-slate-600, .text-slate-700, .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700 ), html[data-theme="dark"] .turma-tema__conteudo :is( .text-slate-500, .text-slate-600, .text-slate-700, .text-slate-800, .text-slate-900, .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700, .text-gray-800, .text-gray-900 )` | `color: var(--turma-texto, #0f172a) !important` |
| [CSS:465](../src/styles/globals.css#L465) | `.turma-card-tema .turma-card-descricao, .turma-card-tema .turma-card-descricao :is(p, span)` | `color: var(--turma-descricao, #64748b) !important` |
| [CSS:470](../src/styles/globals.css#L470) | `html[data-theme="dark"] .turma-card-tema .turma-card-descricao, html[data-theme="dark"] .turma-card-tema .turma-card-descricao :is(p, span)` | `color: var(--turma-descricao, #64748b) !important` |
| [CSS:475](../src/styles/globals.css#L475) | `@layer components › .diretoria-page-canvas` | `background: transparent !important` |
| [CSS:482](../src/styles/globals.css#L482) | `@layer components › .diretoria-workspace` | `background: radial-gradient( circle at 94% 0%, rgb(14 165 233 / 0.13), transparent 21rem ), radial-gradient( circle at 73% 12rem, rgb(249 115 22 / 0.09), transparent 18rem ), #f8fafc` |
| [CSS:504](../src/styles/globals.css#L504) | `@layer components › .diretoria-workspace__bar` | `background: rgb(248 250 252 / 0.88)` |
| [CSS:505](../src/styles/globals.css#L505) | `@layer components › .diretoria-workspace__bar` | `border-bottom: 1px solid rgb(186 230 253 / 0.8)` |
| [CSS:506](../src/styles/globals.css#L506) | `@layer components › .diretoria-workspace__bar` | `backdrop-filter: blur(14px)` |
| [CSS:516](../src/styles/globals.css#L516) | `@layer components › .diretoria-workspace__crumb` | `color: #075985` |
| [CSS:523](../src/styles/globals.css#L523) | `@layer components › .diretoria-workspace__crumb svg` | `color: #f97316` |
| [CSS:527](../src/styles/globals.css#L527) | `@layer components › .diretoria-workspace__hint` | `color: #64748b` |
| [CSS:544](../src/styles/globals.css#L544) | `@layer components › .diretoria-workspace__search` | `border: 1px solid #bae6fd` |
| [CSS:545](../src/styles/globals.css#L545) | `@layer components › .diretoria-workspace__search` | `background: white` |
| [CSS:546](../src/styles/globals.css#L546) | `@layer components › .diretoria-workspace__search` | `color: #475569` |
| [CSS:553](../src/styles/globals.css#L553) | `@layer components › .diretoria-workspace__search svg, .diretoria-workspace__semester svg` | `color: #0284c7` |
| [CSS:557](../src/styles/globals.css#L557) | `@layer components › .diretoria-workspace__search kbd` | `background: #f1f5f9` |
| [CSS:558](../src/styles/globals.css#L558) | `@layer components › .diretoria-workspace__search kbd` | `color: #64748b` |
| [CSS:564](../src/styles/globals.css#L564) | `@layer components › .diretoria-workspace__semester` | `background: #e0f2fe` |
| [CSS:565](../src/styles/globals.css#L565) | `@layer components › .diretoria-workspace__semester` | `color: #0369a1` |
| [CSS:572](../src/styles/globals.css#L572) | `@layer components › .diretoria-workspace__semester strong` | `background: #0284c7` |
| [CSS:573](../src/styles/globals.css#L573) | `@layer components › .diretoria-workspace__semester strong` | `color: white` |
| [CSS:584](../src/styles/globals.css#L584) | `@layer components › .diretoria-page-intro` | `background: #0284c7` |
| [CSS:586](../src/styles/globals.css#L586) | `@layer components › .diretoria-page-intro` | `color: white` |
| [CSS:587](../src/styles/globals.css#L587) | `@layer components › .diretoria-page-intro` | `box-shadow: 0 20px 45px rgb(2 132 199 / 0.2)` |
| [CSS:596](../src/styles/globals.css#L596) | `@layer components › .diretoria-page-intro__orb` | `background: #f97316` |
| [CSS:604](../src/styles/globals.css#L604) | `@layer components › .diretoria-page-intro__loop` | `border: 13px solid rgb(186 230 253 / 0.8)` |
| [CSS:615](../src/styles/globals.css#L615) | `@layer components › .diretoria-page-intro p` | `color: #e0f2fe` |
| [CSS:627](../src/styles/globals.css#L627) | `@layer components › .diretoria-back-link` | `color: #0369a1` |
| [CSS:632](../src/styles/globals.css#L632) | `@layer components › .diretoria-back-link:hover` | `color: #c2410c` |
| [CSS:742](../src/styles/globals.css#L742) | `@media (hover: none) › .group-hover\:opacity-100` | `opacity: 1` |
| [CSS:849](../src/styles/globals.css#L849) | `.turma-tema .turma-semantic-text` | `color: var(--turma-texto, #0f172a) !important` |
| [CSS:853](../src/styles/globals.css#L853) | `.turma-tema .turma-semantic-description` | `color: var(--turma-descricao, #64748b) !important` |
| [CSS:857](../src/styles/globals.css#L857) | `.turma-tema .turma-semantic-accent` | `color: var(--turma-destaque, #ea580c) !important` |
| [CSS:862](../src/styles/globals.css#L862) | `.turma-tema .turma-presenca-titulo, .turma-tema .turma-presenca-icone` | `color: var(--turma-secao-cor, var(--turma-destaque, #ea580c)) !important` |

### global.css

Este arquivo declara fontes. [Código](../mobile/src/global.css)

### animated-icon.module.css

| Linha | Seletor | Declaração |
| --- | --- | --- |
| [CSS:2](../mobile/src/components/animated-icon.module.css#L2) | `.expoLogoBackground` | `background-image: linear-gradient(180deg, #3c9ffe, #0274df)` |

## Expressões dependentes da execução

Estes locais contêm classes ou estilos que a análise estática resolveu parcialmente, como valores obtidos por propriedade, função, tema personalizado, registro ou objeto importado.

| Local | Classe ou estilo |
| --- | --- |
| [_components/diretoria/data-skeleton.tsx:18](../src/app/_components/diretoria/data-skeleton.tsx#L18) | `index * 55` |
| [_components/diretoria/data-skeleton.tsx:28](../src/app/_components/diretoria/data-skeleton.tsx#L28) | `index * 70` |
| [_components/diretoria/presence-grid.tsx:77](../src/app/_components/diretoria/presence-grid.tsx#L77) | `corDoEstado(estado)`, `undefined` |
| [_components/diretoria/presence-grid.tsx:112](../src/app/_components/diretoria/presence-grid.tsx#L112) | `corDoEstado(estado)` |
| [_components/diretoria/presence-grid.tsx:120](../src/app/_components/diretoria/presence-grid.tsx#L120) | `corDoEstado(estado)` |
| [_components/diretoria/presence-grid.tsx:130](../src/app/_components/diretoria/presence-grid.tsx#L130) | `corDoEstado(estado)` |
| [_components/ferramentaCerd.tsx:19](../src/app/_components/ferramentaCerd.tsx#L19) | `ferramenta.cor` |
| [_components/ferramentaCerd.tsx:23](../src/app/_components/ferramentaCerd.tsx#L23) | `ferramenta.cor` |
| [_components/home/ImageWithFallback.tsx:16](../src/app/_components/home/ImageWithFallback.tsx#L16) | `className`, `style` |
| [_components/home/ImageWithFallback.tsx:25](../src/app/_components/home/ImageWithFallback.tsx#L25) | `className`, `style` |
| [_components/screen-tour/painel-tour.tsx:58](../src/app/_components/screen-tour/painel-tour.tsx#L58) | `painel` |
| [_components/turmaCard.tsx:54](../src/app/_components/turmaCard.tsx#L54) | `turma.backgroundColor`, `turma.color` |
| [_components/turmaCard.tsx:65](../src/app/_components/turmaCard.tsx#L65) | `turma.color`, `hexToRgba(turma.color, 0.75)` |
| [_components/turmaCard.tsx:74](../src/app/_components/turmaCard.tsx#L74) | `turma.accentColor` |
| [_components/turmaCard.tsx:120](../src/app/_components/turmaCard.tsx#L120) | `turma.accentColor`, `turma.color` |
| [layout.tsx:30](../src/app/layout.tsx#L30) | `geist.variable` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:11](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L11) | `turma.corFundo` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:28](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L28) | `turma.cor` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:32](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L32) | `turma.corDestaque` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:42](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L42) | `turma.corTitulo` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:48](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L48) | `turma.corTitulo` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:57](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L57) | `turma.corDestaque` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:61](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L61) | `turma.corDestaque` |
| [nexus/dashboard/_components/turma-dashboard-card.tsx:65](../src/app/nexus/dashboard/_components/turma-dashboard-card.tsx#L65) | `turma.corDestaque` |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:119](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L119) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/anotacoes-view.tsx:123](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/anotacoes-view.tsx#L123) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:28](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L28) | `turma.cor` |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:32](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L32) | `turma.corDestaque` |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:70](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L70) | `corTituloLegivel` |
| [nexus/dashboard/turmas/[id]/_components/cabecalho-turma.tsx:76](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/cabecalho-turma.tsx#L76) | `corDescricaoBannerLegivel` |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:157](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L157) | `config.corBg`, `config!.cor`, `cor`, `config.cor` |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:192](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L192) | `config!.cor` |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:201](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L201) | `config!.corBg`, `config!.cor` |
| [nexus/dashboard/turmas/[id]/_components/calendario-aulas.tsx:208](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/calendario-aulas.tsx#L208) | `config!.cor` |
| [nexus/dashboard/turmas/[id]/_components/card-aviso.tsx:25](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/card-aviso.tsx#L25) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:39](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L39) | `cfg.corBg` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:43](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L43) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:47](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L47) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:54](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L54) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:64](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L64) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:105](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L105) | `cfg.corBg`, `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:117](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L117) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:124](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L124) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/detalhes-calendario.tsx:160](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/detalhes-calendario.tsx#L160) | `cfg.cor` |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:116](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L116) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/materiais-view.tsx:120](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/materiais-view.tsx#L120) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/matriz-presenca-view.tsx:44](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L44) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/matriz-presenca-view.tsx:60](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/matriz-presenca-view.tsx#L60) | `cor`, `corLegivel("#ffffff", cor)` |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-desktop.tsx:35](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx#L35) | `undefined` |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-desktop.tsx:39](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-desktop.tsx#L39) | `undefined` |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx:52](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L52) | `turma.cor`, `undefined` |
| [nexus/dashboard/turmas/[id]/_components/navegacao-turma-mobile.tsx:62](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/navegacao-turma-mobile.tsx#L62) | `corDestaqueLegivel`, `corTextoDestaque` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:96](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L96) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:133](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L133) | `cor`, `corLegivel("#ffffff", cor)` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:156](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L156) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:164](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L164) | `config.cor` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:171](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L171) | `cor` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:190](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L190) | `coresEstado.presente`, `misturarCores(coresEstado.presente, "#ffffff", 0.86)` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:200](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L200) | `coresEstado.ausente`, `misturarCores(coresEstado.ausente, "#ffffff", 0.86)` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:210](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L210) | `configuracaoPresenca.a_registrar.cor`, `configuracaoPresenca.a_registrar.fundo` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:238](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L238) | `cor`, `corLegivel("#ffffff", cor)` |
| [nexus/dashboard/turmas/[id]/_components/presenca-view.tsx:258](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/presenca-view.tsx#L258) | `config.cor`, `config.fundo` |
| [nexus/dashboard/turmas/[id]/_components/resumo-turma.tsx:8](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/resumo-turma.tsx#L8) | `turma.cor` |
| [nexus/dashboard/turmas/[id]/_components/search-select.tsx:61](../src/app/nexus/dashboard/turmas/%5Bid%5D/_components/search-select.tsx#L61) | `accent` |
| [nexus/dashboard/turmas/[id]/page.tsx:98](../src/app/nexus/dashboard/turmas/%5Bid%5D/page.tsx#L98) | `fundoTurma`, `corDestaqueLegivel`, `corTextoDestaque`, `corTextoLegivel`, `corDescricaoLegivel` |
| [nexus/diretoria/_components/stat-mini.tsx:18](../src/app/nexus/diretoria/_components/stat-mini.tsx#L18) | `cor` |
| [nexus/diretoria/_components/stat-mini.tsx:22](../src/app/nexus/diretoria/_components/stat-mini.tsx#L22) | `cor` |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:114](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L114) | `estiloVerInformacoes` |
| [nexus/diretoria/alunos/_components/lista-alunos.tsx:152](../src/app/nexus/diretoria/alunos/_components/lista-alunos.tsx#L152) | `estiloExcluirAluno` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:69](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L69) | `formulario` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:99](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L99) | `campo` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:109](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L109) | `campo` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:125](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L125) | `campo` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:148](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L148) | `campo` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:177](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L177) | `botao` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:191](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L191) | `botaoSecundario` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:211](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L211) | `linha` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:227](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L227) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/doacoes.tsx:245](../src/app/nexus/diretoria/conecta/_components/doacoes.tsx#L245) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/equipes.tsx:64](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L64) | `formulario` |
| [nexus/diretoria/conecta/_components/equipes.tsx:86](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L86) | `campo` |
| [nexus/diretoria/conecta/_components/equipes.tsx:102](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L102) | `campo` |
| [nexus/diretoria/conecta/_components/equipes.tsx:112](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L112) | `campo` |
| [nexus/diretoria/conecta/_components/equipes.tsx:140](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L140) | `corInicial`, `corFinal` |
| [nexus/diretoria/conecta/_components/equipes.tsx:149](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L149) | `botao` |
| [nexus/diretoria/conecta/_components/equipes.tsx:160](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L160) | `botaoSecundario` |
| [nexus/diretoria/conecta/_components/equipes.tsx:180](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L180) | `linha` |
| [nexus/diretoria/conecta/_components/equipes.tsx:181](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L181) | `equipe.corInicial`, `equipe.corFinal` |
| [nexus/diretoria/conecta/_components/equipes.tsx:195](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L195) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/equipes.tsx:210](../src/app/nexus/diretoria/conecta/_components/equipes.tsx#L210) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/itens.tsx:57](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L57) | `formulario` |
| [nexus/diretoria/conecta/_components/itens.tsx:83](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L83) | `campo` |
| [nexus/diretoria/conecta/_components/itens.tsx:93](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L93) | `campo` |
| [nexus/diretoria/conecta/_components/itens.tsx:102](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L102) | `campo` |
| [nexus/diretoria/conecta/_components/itens.tsx:122](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L122) | `botao` |
| [nexus/diretoria/conecta/_components/itens.tsx:130](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L130) | `botaoSecundario` |
| [nexus/diretoria/conecta/_components/itens.tsx:150](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L150) | `linha` |
| [nexus/diretoria/conecta/_components/itens.tsx:159](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L159) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/itens.tsx:173](../src/app/nexus/diretoria/conecta/_components/itens.tsx#L173) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/provas.tsx:59](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L59) | `formulario` |
| [nexus/diretoria/conecta/_components/provas.tsx:81](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L81) | `campo` |
| [nexus/diretoria/conecta/_components/provas.tsx:92](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L92) | `campo` |
| [nexus/diretoria/conecta/_components/provas.tsx:108](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L108) | `campo` |
| [nexus/diretoria/conecta/_components/provas.tsx:117](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L117) | `campo` |
| [nexus/diretoria/conecta/_components/provas.tsx:133](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L133) | `botao` |
| [nexus/diretoria/conecta/_components/provas.tsx:146](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L146) | `botaoSecundario` |
| [nexus/diretoria/conecta/_components/provas.tsx:166](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L166) | `linha` |
| [nexus/diretoria/conecta/_components/provas.tsx:180](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L180) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/provas.tsx:194](../src/app/nexus/diretoria/conecta/_components/provas.tsx#L194) | `botaoIcone` |
| [nexus/diretoria/conecta/_components/ranking.tsx:115](../src/app/nexus/diretoria/conecta/_components/ranking.tsx#L115) | `cores(equipe)` |
| [nexus/diretoria/conecta/_components/ranking.tsx:303](../src/app/nexus/diretoria/conecta/_components/ranking.tsx#L303) | `cores(equipe)` |
| [nexus/diretoria/conecta/page.tsx:59](../src/app/nexus/diretoria/conecta/page.tsx#L59) | `campo` |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:50](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L50) | `campo` |
| [nexus/diretoria/estoque/_components/categorias-estoque.tsx:59](../src/app/nexus/diretoria/estoque/_components/categorias-estoque.tsx#L59) | `botaoPrimario` |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:44](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L44) | `campo` |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:55](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L55) | `campo` |
| [nexus/diretoria/estoque/_components/filtros-estoque.tsx:64](../src/app/nexus/diretoria/estoque/_components/filtros-estoque.tsx#L64) | `campo` |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:41](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L41) | `campo` |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:54](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L54) | `campo` |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:69](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L69) | `campo` |
| [nexus/diretoria/estoque/_components/formulario-item.tsx:126](../src/app/nexus/diretoria/estoque/_components/formulario-item.tsx#L126) | `botaoPrimario` |
| [nexus/diretoria/estoque/page.tsx:165](../src/app/nexus/diretoria/estoque/page.tsx#L165) | `botaoPrimario` |
| [nexus/diretoria/formularios/_components/icone-opcao.tsx:14](../src/app/nexus/diretoria/formularios/_components/icone-opcao.tsx#L14) | `className` |
| [nexus/diretoria/formularios/_components/icone-opcao.tsx:16](../src/app/nexus/diretoria/formularios/_components/icone-opcao.tsx#L16) | `className` |
| [nexus/diretoria/formularios/_components/icone-opcao.tsx:18](../src/app/nexus/diretoria/formularios/_components/icone-opcao.tsx#L18) | `className` |
| [nexus/diretoria/presencas/page.tsx:112](../src/app/nexus/diretoria/presencas/page.tsx#L112) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:48](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L48) | `corFundo` |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:54](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L54) | `corTexto` |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:57](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L57) | `corDescricao` |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:63](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L63) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx:71](../src/app/nexus/diretoria/turmas/_components/equipe-gestao-turma.tsx#L71) | `corDescricao` |
| [nexus/diretoria/turmas/_components/ficha-aluno-completa.tsx:121](../src/app/nexus/diretoria/turmas/_components/ficha-aluno-completa.tsx#L121) | `vinculo.turma.cor` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:110](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L110) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:115](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L115) | `turma.cor` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:119](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L119) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:125](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L125) | `turma.corTitulo` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:133](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L133) | `turma.corTitulo` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:142](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L142) | `turma.corTitulo` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:155](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L155) | `turma.cor` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:172](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L172) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:255](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L255) | `turma.corFundo` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:259](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L259) | `turma.corTexto` |
| [nexus/diretoria/turmas/_components/janela-gestao-turma.tsx:262](../src/app/nexus/diretoria/turmas/_components/janela-gestao-turma.tsx#L262) | `turma.corDescricao` |
| [nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx:30](../src/app/nexus/diretoria/turmas/_components/modal-ficha-aluno.tsx#L30) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/search-select.tsx:77](../src/app/nexus/diretoria/turmas/_components/search-select.tsx#L77) | `accent` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:32](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L32) | `turma.corFundo`, `turma.corTexto`, `turma.corDescricao` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:49](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L49) | `turma.cor` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:53](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L53) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:62](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L62) | `turma.corTitulo` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:109](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L109) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:116](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L116) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/turma-card.tsx:124](../src/app/nexus/diretoria/turmas/_components/turma-card.tsx#L124) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:92](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L92) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:96](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L96) | `corTexto` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:99](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L99) | `corDescricao` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:185](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L185) | `corFundo` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:189](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L189) | `corTexto` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:192](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L192) | `corDescricao` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:211](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L211) | `corTexto` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:217](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L217) | `corDescricao` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:229](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L229) | `corFundo` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:233](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L233) | `corTexto` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:243](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L243) | `corTexto` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:249](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L249) | `turma.corDestaque` |
| [nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx:258](../src/app/nexus/diretoria/turmas/_components/visao-geral-gestao-turma.tsx#L258) | `corDescricao` |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:8](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L8) | `turma.corFundo`, `turma.corTexto`, `turma.corDescricao` |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:25](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L25) | `turma.cor` |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:29](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L29) | `turma.corDestaque` |
| [nexus/diretoria/turmas/controle/_components/controle-card.tsx:38](../src/app/nexus/diretoria/turmas/controle/_components/controle-card.tsx#L38) | `turma.corTitulo` |
| [questionarios/[slug]/_components/estado-enviado.tsx:22](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L22) | `fonte`, `configuracao.corFundo` |
| [questionarios/[slug]/_components/estado-enviado.tsx:27](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L27) | `configuracao.corDestaque` |
| [questionarios/[slug]/_components/estado-enviado.tsx:36](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L36) | `configuracao.corPrimaria` |
| [questionarios/[slug]/_components/estado-enviado.tsx:43](../src/app/questionarios/%5Bslug%5D/_components/estado-enviado.tsx#L43) | `configuracao.corDestaque` |
| [questionarios/[slug]/_components/estado-respondido.tsx:16](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L16) | `fonte`, `configuracao.corFundo` |
| [questionarios/[slug]/_components/estado-respondido.tsx:21](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L21) | `configuracao.corDestaque` |
| [questionarios/[slug]/_components/estado-respondido.tsx:32](../src/app/questionarios/%5Bslug%5D/_components/estado-respondido.tsx#L32) | `configuracao.corDestaque` |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:66](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L66) | `configuracao.corPrimaria` |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:89](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L89) | `configuracao.corDestaque` |
| [questionarios/[slug]/_components/formulario-resposta-questionario.tsx:143](../src/app/questionarios/%5Bslug%5D/_components/formulario-resposta-questionario.tsx#L143) | `configuracao.corDestaque` |
| [questionarios/[slug]/page.tsx:69](../src/app/questionarios/%5Bslug%5D/page.tsx#L69) | `configuracao.corFundo` |
| [questionarios/[slug]/page.tsx:104](../src/app/questionarios/%5Bslug%5D/page.tsx#L104) | `configuracao.corFundo` |

## Totais da coleta

- Casos de JSX reconstruídos: 2.112.
- Medições: 12.166, com 11.855 comparações sobre cores resolvidas e 311 dependentes de fundo ou efeito.
- Referências únicas abaixo de algum limiar: 942 pares de linha e propriedade.
- Classes no inventário: 567.
- Declarações de cor e efeitos nos seis arquivos CSS: 354.
- Expressões com resolução parcial: 181.
