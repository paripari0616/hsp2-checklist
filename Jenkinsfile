pipeline {
  agent any

  environment {
    IMAGE_NAME = 'hsp2-checklist'
    CONTAINER_NAME = 'hsp2-checklist'
    HOST_PORT = '8080'
  }

  stages {
    stage('Validate') {
      steps {
        sh 'test -f index.html'
        sh 'test -f styles.css'
        sh 'test -f app.js'
      }
    }

    stage('Build image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:latest .'
      }
    }

    stage('Deploy local container') {
      steps {
        sh 'docker rm -f ${CONTAINER_NAME} || true'
        sh 'docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p ${HOST_PORT}:80 ${IMAGE_NAME}:latest'
      }
    }
  }

  post {
    success {
      echo "Published at http://localhost:${HOST_PORT}"
    }
  }
}
