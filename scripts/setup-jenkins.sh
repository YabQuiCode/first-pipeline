#!/bin/bash
# ============================================
# Script d'installation de Jenkins via Docker
# ============================================

set -euo pipefail

echo "=== Installation de Jenkins ==="

# Créer le réseau Docker si inexistant
docker network create jenkins 2>/dev/null || true

# Lancer Jenkins
docker run -d \
  --name jenkins \
  --restart=on-failure \
  --network jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

echo ""
echo "=== Jenkins démarré ==="
echo "URL: http://localhost:8080"
echo ""
echo "Mot de passe initial:"
echo "  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
echo ""
echo "Plugins requis:"
echo "  - Git"
echo "  - Pipeline"
echo "  - Docker Pipeline"
echo "  - NodeJS"
echo ""

# Lancer le registry local
docker run -d \
  --name registry \
  --restart=on-failure \
  --network jenkins \
  -p 5000:5000 \
  registry:2

echo "=== Registry local démarré sur localhost:5000 ==="
