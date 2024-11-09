terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.16.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock" # Para comunicarse con el daemon de Docker
}
