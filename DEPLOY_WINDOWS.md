# Solução para erro "Filename too long" no Windows

## Problema
O erro ocorre devido ao limite de 260 caracteres para caminhos no Windows. O `gh-pages` cria cache em locais com caminhos muito longos.

## Soluções Rápidas

### Solução 1: Usar o script PowerShell (RECOMENDADO)

Execute no PowerShell:

```powershell
.\deploy.ps1
```

O script faz tudo automaticamente e evita o problema de cache do gh-pages.

### Solução 2: Habilitar caminhos longos no Git

Abra o PowerShell como **Administrador** e execute:

```powershell
git config --system core.longpaths true
```

Depois limpe o cache e tente novamente:

```powershell
Remove-Item -Recurse -Force node_modules\.cache\gh-pages -ErrorAction SilentlyContinue
npm run deploy
```

### Solução 3: Mover projeto para caminho mais curto

Mova o projeto para um caminho mais curto, como:

```
C:\Projetos\Unidas_MS_ConsultaScore\
```

Em vez de:

```
C:\Users\Gabriel\Downloads\Coisas\Trabalho\Versions - ConsultaScore\project-bolt-sb1-dp8crgys\project\
```

### Solução 4: Usar deploy manual

Execute os comandos manualmente:

```powershell
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

## Configurar GitHub Pages

Após o deploy bem-sucedido:

1. Acesse o repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione a branch `gh-pages`
4. Clique em **Save**
5. Aguarde alguns minutos e acesse: `https://SEU_USUARIO.github.io/Unidas_MS_ConsultaScore/`

## Próximos deploys

Para os próximos deploys, use sempre o script PowerShell:

```powershell
.\deploy.ps1
```

Ele evita o problema de cache e funciona perfeitamente no Windows.
