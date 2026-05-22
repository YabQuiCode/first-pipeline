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
                echo "Code source recupere"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo "Dependances installees"
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
                echo "Tests unitaires passes"
            }
            post {
                failure {
                    echo "Tests echoues - pipeline bloque"
                }
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
                echo "Build de production genere"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION} -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest ."
                echo "Image Docker construite: ${IMAGE_NAME}:${VERSION}"
            }
        }

        stage('Push to Registry') {
            steps {
                sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}"
                sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
                echo "Image poussee vers ${DOCKER_REGISTRY}"
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop taskflow-app || true
                    docker rm taskflow-app || true
                    docker run -d \
                        --name taskflow-app \
                        -p 3000:80 \
                        --restart unless-stopped \
                        localhost:5000/taskflow:latest
                '''
                echo "Application deployee sur http://localhost:3000"
            }
        }
    }

    post {
        success {
            echo """
            ====================================
            PIPELINE REUSSI
            Image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}
            App:   http://localhost:3000
            ====================================
            """
        }
        failure {
            echo """
            ====================================
            PIPELINE ECHOUE
            Verifier les logs ci-dessus
            ====================================
            """
        }
        always {
            cleanWs()
        }
    }
}
