#!/bin/bash
# Script de deploy manual para Linux/Mac

echo "Iniciando deploy manual..."

# Build do projeto
echo -e "\nExecutando build..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "\nErro no build!"
    exit 1
fi

# Navegar para dist
cd dist

# Inicializar git
echo -e "\nInicializando repositório..."
git init

# Adicionar arquivos
echo "Adicionando arquivos..."
git add -A

# Commit
echo "Criando commit..."
git commit -m "Deploy"

# Criar branch gh-pages
echo "Criando branch gh-pages..."
git branch -M gh-pages

# Perguntar URL do repositório
read -p "Digite a URL do repositório (ex: https://github.com/usuario/Unidas_MS_ConsultaScore.git): " repoUrl

# Adicionar remote
git remote add origin "$repoUrl"

# Push forçado
echo -e "\nFazendo push..."
git push -f origin gh-pages

# Voltar ao diretório anterior
cd ..

echo -e "\nDeploy concluído com sucesso!"
echo "Configure o GitHub Pages em: Settings > Pages > Source: gh-pages"
