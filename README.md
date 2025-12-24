# Unidas - Consulta Score Serasa

POC para consulta de Score Serasa da Unidas Locadora.

## Funcionalidades

- Consulta individual de score para múltiplos CNPJs
- Validação automática de CNPJs (14 dígitos)
- Indicador de progresso em tempo real
- Tabela de resultados com status e mensagens de erro
- Copiar resultados para área de transferência
- Sem armazenamento local de tokens (segurança)

## Como usar

1. Cole o Bearer Token no campo correspondente
2. Digite os CNPJs (um por linha ou separados por vírgula)
3. Clique em "Buscar Scores"
4. Acompanhe o progresso em tempo real
5. Copie os resultados quando finalizado

## Deploy no GitHub Pages

### Passo 1: Criar o repositório

1. Crie o repositório `Unidas_MS_ConsultaScore` no GitHub
2. Clone o repositório localmente e adicione os arquivos do projeto
3. Faça o push inicial:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Passo 2: Deploy

#### Opção A: Deploy automático (Linux/Mac ou Windows configurado)

```bash
npm run deploy
```

#### Opção B: Deploy manual (recomendado para Windows)

Se o deploy automático falhar com erro "Filename too long", use uma destas opções:

**1. Script PowerShell (Windows):**
```powershell
.\deploy.ps1
```

**2. Script Bash (Linux/Mac):**
```bash
chmod +x deploy.sh
./deploy.sh
```

**3. Comandos manuais:**
```bash
npm run build
cd dist
git init
git add -A
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin https://github.com/SEU_USUARIO/Unidas_MS_ConsultaScore.git
git push -f origin gh-pages
cd ..
```

### Passo 3: Configurar GitHub Pages (primeira vez)

1. Acesse as configurações do repositório no GitHub
2. Vá em "Settings" > "Pages"
3. Em "Source", selecione a branch `gh-pages` e pasta `/ (root)`
4. Clique em "Save"
5. Aguarde alguns minutos e acesse: `https://SEU_USUARIO.github.io/Unidas_MS_ConsultaScore/`

### Troubleshooting Windows

Se encontrar o erro "Filename too long":

1. Mova o projeto para um caminho mais curto (ex: `C:\Projetos\Unidas_MS_ConsultaScore\`)
2. Ou habilite suporte a caminhos longos:
   ```bash
   git config --system core.longpaths true
   ```
3. Limpe o cache:
   ```bash
   rm -r node_modules\.cache\gh-pages
   ```

## Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)
- gh-pages (deploy automático)

## API

Endpoint: `https://sirius.hml.unidas.com.br/rac/integracoes/serasa/v1/hpj9/score`

### Extração do Score

O score é extraído do caminho: `Data.Data.DV_Relato.RelatoB49C[0].Modelos.Score.ScoreSerasa`

## Estrutura do Projeto

```
src/
├── components/
│   └── ResultsTable.tsx    # Tabela de resultados
├── types/
│   └── api.ts              # Tipos TypeScript
├── utils/
│   ├── api.ts              # Funções de chamada à API
│   └── cnpj.ts             # Validação e formatação de CNPJ
├── App.tsx                 # Componente principal
└── main.tsx                # Entry point
```
