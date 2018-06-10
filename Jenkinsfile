pipeline {
  agent {
    label "docker"
  }

  environment {
    GITHUB_ACCESS_TOKEN = credentials("jenkins-hibes_github_access_token")
  }

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "rm -rf reports/*" },
          "install": { sh "/usr/bin/env bash -c '. ~/.bash_profile; yarn install'" },
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
      sh "/usr/bin/env bash -c '. ~/.bash_profile; node bin/mochawesome_to_markdown.js --mochawesome reports/unit/mochawesome.json > reports/unit.githubCommentFile'"
      sh "cat reports/*.githubCommentFile > reports/githubCommentFile"
      sh "/usr/bin/env bash -c 'node https://api.github.com/repos/${ghprbGhRepository}/issues/${ghprbPullId}/comments'"
    }
  }
}
