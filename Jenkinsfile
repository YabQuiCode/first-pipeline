pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:5000'
        IMAGE_NAME = 'taskflow'
        VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'local'}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✓ Code source récupéré"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo "✓ Dépendances installées"
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || true'
                echo "✓ Lint terminé"
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
                echo "✓ Tests unitaires passés"
            }
            post {
                failure {
                    echo "✗ Tests échoués — pipeline bloqué"
                }
                always {
                    // Archiver les résultats de tests si disponibles
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
                echo "✓ Build de production généré"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}")
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:latest")
                }
                echo "✓ Image Docker construite: ${IMAGE_NAME}:${VERSION}"
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}") {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:latest").push()
                    }
                }
                echo "✓ Image poussée vers ${DOCKER_REGISTRY}"
            }
        }
    }

    post {
        success {
            echo """
            ====================================
            ✓ PIPELINE RÉUSSI
            Image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}
            ====================================
            """
        }
        failure {
            echo """
            ====================================
            ✗ PIPELINE ÉCHOUÉ
            Vérifier les logs ci-dessus
            ====================================
            """
        }
        always {
            cleanWs()
        }
    }
}
