#!/bin/bash

# Neurex 설정 동기화 스크립트
# neurex 레포에서 최신 설정을 가져와 적용합니다.
#
# 사용법: ./scripts/sync-neurex.sh [neurex-path]

set -e

NEUREX_PATH=${1:-"$HOME/projects/neurex"}
WORKSPACE_PATH="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔄 Neurex 설정 동기화"
echo "   Neurex: $NEUREX_PATH"
echo "   Workspace: $WORKSPACE_PATH"
echo ""

# neurex 경로 확인
if [ ! -d "$NEUREX_PATH" ]; then
    echo "❌ Neurex 경로를 찾을 수 없습니다: $NEUREX_PATH"
    echo ""
    echo "사용법: ./scripts/sync-neurex.sh [neurex-path]"
    echo "예시: ./scripts/sync-neurex.sh ~/projects/neurex"
    exit 1
fi

# sync 스크립트 확인
SYNC_SCRIPT="$NEUREX_PATH/scripts/sync-to-project.sh"
if [ ! -f "$SYNC_SCRIPT" ]; then
    echo "❌ Neurex sync 스크립트를 찾을 수 없습니다: $SYNC_SCRIPT"
    exit 1
fi

# 동기화 실행
echo "📦 동기화 중..."
"$SYNC_SCRIPT" "$WORKSPACE_PATH" --project prix

echo ""
echo "✅ 동기화 완료!"
echo ""
echo "변경사항 확인:"
echo "  git status"
echo ""
echo "변경사항 커밋:"
echo "  git add .claude/ .opencode/"
echo "  git commit -m 'chore: sync neurex settings'"
