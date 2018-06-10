node {
  docker.image("keymux/docker-ubuntu-nvm-yarn").inside("-e NODE_VERSION=v6.10.2") {
    sh "rm -rf reports/*"
    sh "yarn install"
    sh "yarn test:unit"
    sh "yarn report:unit"
    sh "yarn report:summary"
  }
}
