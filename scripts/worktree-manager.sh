#!/bin/bash
# Git Worktree Manager for typescript-kambun
# Usage: ./scripts/worktree-manager.sh [command] [branch-name]

set -e

WORKTREE_BASE="../typescript-kambun-worktrees"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

function show_usage() {
    cat << EOF
Git Worktree Manager for typescript-kambun

Usage:
    $0 list                      - List all worktrees
    $0 add <branch-name>         - Add new worktree for branch
    $0 remove <branch-name>      - Remove worktree for branch
    $0 create <branch-name>      - Create new branch and worktree
    $0 help                      - Show this help message

Examples:
    $0 list
    $0 add feature/new-parser
    $0 create feature/improve-algorithm
    $0 remove feature/old-feature

Worktrees Location: ${WORKTREE_BASE}
EOF
}

function list_worktrees() {
    echo "=== Current Worktrees ==="
    git worktree list
}

function add_worktree() {
    local branch_name="$1"
    if [[ -z "$branch_name" ]]; then
        echo "Error: Branch name required"
        echo "Usage: $0 add <branch-name>"
        exit 1
    fi

    # Convert branch name to directory name (replace / with -)
    local dir_name="${branch_name//\//-}"
    local worktree_path="${WORKTREE_BASE}/${dir_name}"

    echo "Creating worktree for branch: $branch_name"
    echo "Location: $worktree_path"

    cd "$REPO_DIR"
    git worktree add "$worktree_path" "$branch_name"

    echo "✓ Worktree created successfully"
    echo "  cd $worktree_path"
}

function remove_worktree() {
    local branch_name="$1"
    if [[ -z "$branch_name" ]]; then
        echo "Error: Branch name required"
        echo "Usage: $0 remove <branch-name>"
        exit 1
    fi

    local dir_name="${branch_name//\//-}"
    local worktree_path="${WORKTREE_BASE}/${dir_name}"

    echo "Removing worktree: $worktree_path"

    cd "$REPO_DIR"
    git worktree remove "$worktree_path"

    echo "✓ Worktree removed successfully"
}

function create_branch_and_worktree() {
    local branch_name="$1"
    if [[ -z "$branch_name" ]]; then
        echo "Error: Branch name required"
        echo "Usage: $0 create <branch-name>"
        exit 1
    fi

    local dir_name="${branch_name//\//-}"
    local worktree_path="${WORKTREE_BASE}/${dir_name}"

    echo "Creating new branch and worktree: $branch_name"
    echo "Location: $worktree_path"

    cd "$REPO_DIR"
    git worktree add -b "$branch_name" "$worktree_path"

    echo "✓ Branch and worktree created successfully"
    echo "  cd $worktree_path"
}

# Main command dispatcher
case "${1:-help}" in
    list|ls)
        list_worktrees
        ;;
    add)
        add_worktree "$2"
        ;;
    remove|rm)
        remove_worktree "$2"
        ;;
    create|new)
        create_branch_and_worktree "$2"
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "Error: Unknown command '$1'"
        echo ""
        show_usage
        exit 1
        ;;
esac
