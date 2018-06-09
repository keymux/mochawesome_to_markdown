pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "/usr/bin/env bash -c '. ~/.bash_profile; yarn install'" },
          "env": { sh "/usr/bin/env bash -c 'env'" }
        )
      }
    }

    stage("test") {
      steps {
        parallel (
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:unit'" }
        )
      }
    }
  }

  post {
    always {
      sh "src/mochawesome_to_markdown.bin.js --mochawesome reports/unit/mochawesome.json"
      sh "cat reports/*.githubCommentFile > reports/githubCommentFile"
    }
  }
}
