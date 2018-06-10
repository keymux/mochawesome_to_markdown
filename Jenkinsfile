pipeline {
  agent any

  environment {
    GITHUB_ACCESS_TOKEN = credentials("jenkins-hibes_github_access_token")
  }


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
      sh "yarn reports:unit"
      sh "yarn reports:summary"
      sh "yarn submit:github"
    }
  }
}
