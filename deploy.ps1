# Script de deploy manual para Windows
# Execute este script se o 'npm run deploy' falhar com erro de caminho longo

Write-Host "Iniciando deploy manual..." -ForegroundColor Green

# Build do projeto
Write-Host "`nExecutando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nErro no build!" -ForegroundColor Red
    exit 1
}

# Navegar para dist
Set-Location dist

# Inicializar git
Write-Host "`nInicializando repositório..." -ForegroundColor Yellow
git init

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add -A

# Commit
Write-Host "Criando commit..." -ForegroundColor Yellow
git commit -m "Deploy"

# Criar branch gh-pages
Write-Host "Criando branch gh-pages..." -ForegroundColor Yellow
git branch -M gh-pages

# Perguntar URL do repositório
$repoUrl = Read-Host "`nDigite a URL do repositório (ex: https://github.com/usuario/Unidas_MS_ConsultaScore.git)"

# Adicionar remote
git remote add origin $repoUrl

# Push forçado
Write-Host "`nFazendo push..." -ForegroundColor Yellow
git push -f origin gh-pages

# Voltar ao diretório anterior
Set-Location ..

Write-Host "`nDeploy concluído com sucesso!" -ForegroundColor Green
Write-Host "Configure o GitHub Pages em: Settings > Pages > Source: gh-pages" -ForegroundColor Cyan
