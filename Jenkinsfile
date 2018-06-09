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
          "test:unit": { sh "/usr/bin/env bash -c '. ~/.bash_profile; yarn test:unit'" }
        )
      }
    }
  }

  post {
    always {
      sh "/usr/bin/env bash -c '. ~/.bash_profile; node src/mochawesome_to_markdown.bin.js --mochawesome reports/unit/mochawesome.json > reports/unit.githubCommentFile"
      sh "cat reports/*.githubCommentFile > reports/githubCommentFile"
    }
  }
}
