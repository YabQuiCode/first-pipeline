#!/bin/bash
# ============================================
# Script de déploiement TaskFlow
# Stratégie : Rolling Update (sans coupure)
# ============================================

set -euo pipefail

# --- Configuration ---
APP_NAME="taskflow"
REGISTRY="${REGISTRY:-localhost:5000}"
IMAGE="${REGISTRY}/${APP_NAME}"
ENV="${DEPLOY_ENV:-prod}"
COMPOSE_FILE="docker-compose.yml"
HEALTH_URL="http://localhost:80/"
ROLLBACK_TIMEOUT=60

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Fonctions ---

get_current_version() {
    docker inspect --format='{{.Config.Image}}' ${APP_NAME}-app 2>/dev/null || echo "none"
}

health_check() {
    local retries=10
    local wait=3
    log "Vérification de santé..."
    for i in $(seq 1 $retries); do
        if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
            log "✓ Application accessible (tentative $i/$retries)"
            return 0
        fi
        warn "Tentative $i/$retries - en attente ${wait}s..."
        sleep $wait
    done
    error "✗ Health check échoué après $retries tentatives"
    return 1
}

rollback() {
    error "Déploiement échoué — ROLLBACK en cours..."
    local previous_image="$1"
    if [ "$previous_image" != "none" ]; then
        TAG="${previous_image##*:}" docker compose -f $COMPOSE_FILE up -d --no-deps app
        log "Rollback vers: $previous_image"
        if health_check; then
            log "✓ Rollback réussi"
        else
            error "✗ Rollback échoué — intervention manuelle requise"
            exit 2
        fi
    fi
    exit 1
}

# --- Déploiement principal ---

main() {
    log "======================================"
    log "Déploiement TaskFlow — Env: ${ENV}"
    log "======================================"

    # Sauvegarder la version actuelle (pour rollback)
    PREVIOUS_VERSION=$(get_current_version)
    log "Version actuelle: ${PREVIOUS_VERSION}"

    # Charger la config environnement
    if [ -f ".env.${ENV}" ]; then
        log "Chargement config: .env.${ENV}"
        export $(grep -v '^#' .env.${ENV} | xargs)
    fi

    # Récupérer la dernière image
    log "Pull de la dernière image..."
    docker compose -f $COMPOSE_FILE pull app || true

    # Rolling update : démarrer le nouveau container
    log "Démarrage du nouveau container (rolling update)..."
    docker compose -f $COMPOSE_FILE up -d --no-deps --build app

    # Vérification de santé
    if ! health_check; then
        rollback "$PREVIOUS_VERSION"
    fi

    # Nettoyage des anciennes images
    log "Nettoyage des images inutilisées..."
    docker image prune -f

    log "======================================"
    log "✓ DÉPLOIEMENT RÉUSSI"
    log "  Image: $(get_current_version)"
    log "  Date: $(date '+%Y-%m-%d %H:%M:%S')"
    log "======================================"
}

# Exécution
main "$@"
