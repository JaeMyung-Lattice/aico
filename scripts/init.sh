#!/bin/bash

# Prix Workspace 초기화 스크립트
# 사용법: ./scripts/init.sh <prix-server-url> <prix-client-url>

set -e

PRIX_SERVER_URL=${1:-""}
PRIX_CLIENT_URL=${2:-""}

echo "🚀 Prix Workspace 초기화"
echo ""

# URL 확인
if [ -z "$PRIX_SERVER_URL" ] || [ -z "$PRIX_CLIENT_URL" ]; then
    echo "사용법: ./scripts/init.sh <prix-server-url> <prix-client-url>"
    echo ""
    echo "예시:"
    echo "  ./scripts/init.sh https://github.com/myorg/prix-server.git https://github.com/myorg/prix-client.git"
    exit 1
fi

# Git 초기화 (이미 되어있지 않은 경우)
if [ ! -d ".git" ]; then
    echo "📦 Git 저장소 초기화..."
    git init
fi

# Submodule 추가
echo "📦 prix-server 추가 중..."
git submodule add "$PRIX_SERVER_URL" prix-server

echo "📦 prix-client 추가 중..."
git submodule add "$PRIX_CLIENT_URL" prix-client

# 초기 커밋
echo "📝 초기 커밋 생성..."
git add .
git commit -m "chore: initialize prix-workspace with submodules"

echo ""
echo "✅ 초기화 완료!"
echo ""
echo "다음 단계:"
echo "  1. GitHub에 prix-workspace 레포 생성"
echo "  2. git remote add origin <your-workspace-repo-url>"
echo "  3. git push -u origin main"
echo ""
echo "사용법:"
echo "  claude    # Claude Code 시작"
echo "  opencode  # OpenCode 시작"
