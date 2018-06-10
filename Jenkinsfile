pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "yarn reports:clean" },
          "install": { sh "yarn install" }
        )
      }
    }

    stage("test") {
      steps {
        parallel (
          "test:unit": { sh "yarn test:unit" }
        )
      }
    }
  }

  post {
    always {
      sh "reports:unit",
      sh "reports:summary"
    }
  }
}
