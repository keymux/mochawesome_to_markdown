node {
  docker.image("keymux/docker-ubuntu-nvm-yarn").inside("-e NODE_VERSION=v6.10.2") {
    stages {
      stage("build") {
        steps {
          parallel (
            "clean": { sh "rm -rf reports/*" },
            "install": { sh "yarn install" }
          )
        }
      }

      stage("test") {
        steps  {
          parallel(
            "test:unit": { sh "yarn test:unit" }
          )
        }
      }
    }
    post {
      always {
        sh "yarn report:unit",
        sh "yarn report:summary"
      }
    }
  }
}
