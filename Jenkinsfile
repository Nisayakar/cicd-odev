pipeline {
    agent any

    tools {
        maven 'M3'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins job SCM ayari ile calisir. Gerekirse buraya git url eklenebilir.
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean package'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat '''
                    where npm
                    if %ERRORLEVEL% EQU 0 (
                        npm install
                        npm run build
                    ) else (
                        echo npm PATH icinde bulunamadi. Node Docker image ile frontend build aliniyor.
                        docker run --rm -v "%cd%:/app" -w /app node:22-alpine sh -c "npm install && npm run build"
                    )
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Docker Deploy') {
            steps {
                bat 'docker compose down || exit /b 0'
                bat 'docker compose up -d --build'
            }
        }

        stage('Verify') {
            steps {
                bat 'docker compose ps'
            }
        }
    }
}
