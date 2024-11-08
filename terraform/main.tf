# Define una red compartida
resource "docker_network" "app_network" {
  name = "app-network"
}

# Volumen para MongoDB
resource "docker_volume" "mongo_data" {
  name = "mongo_data"
}

# Volumen para Redis
resource "docker_volume" "cache_data" {
  name = "cache_data"
}

# Volumen para los ficheros estáticos
resource "docker_volume" "static_files" {
  name = "static_files"
}

# Imagen del frontend (React)
# data "docker_image" "frontend_image" {
# name = "frontend_image"
# build {
#   path = abspath("${path.module}/../frontend")
# }

# lifecycle {
#   create_before_destroy = false
#   prevent_destroy       = true
# }
# }

# Imagen del frontend (React) (se usa data porque la imagen ya está construida pero terraform la intenta reconstruir y se acaba el tiempo)
data "docker_image" "frontend_image" {
  name = "frontend_image"
}

# Contenedor de las instancias de la aplicación web
resource "docker_container" "web_app" {
  count = var.INSTANCE_COUNT
  name  = "web_app_${count.index + 1}" # Nombre único para cada instancia
  image = "frontend_image:latest"

  cpu_shares = var.NODE_ENV == "production" ? 512 : 256
  memory     = var.NODE_ENV == "production" ? 1536 : 768

  ports {
    internal = 3000
  }

  env = [
    "NODE_ENV=${var.NODE_ENV}",
    "REACT_APP_INSTANCE_ID=web_app_${count.index + 1}"
  ]

  volumes {
    host_path      = abspath("${path.module}/../frontend")
    container_path = "/app"
  }

  # Monta el volumen compartido para archivos estáticos
  volumes {
    volume_name    = docker_volume.static_files.name
    container_path = "/app/static"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.backend]
}

# Backend (Node.js)
resource "docker_image" "backend_image" {
  name = "backend_image"
  build {
    path = abspath("${path.module}/../backend")
  }

  lifecycle {
    create_before_destroy = false
    prevent_destroy       = true
  }
}

# Contenedor del backend (Node.js)
resource "docker_container" "backend" {
  name  = "backend"
  image = "backend_image:latest"

  memory     = 2048
  cpu_shares = 1024

  ports {
    internal = 8000
    external = 8000
  }

  env = [
    "NODE_ENV=${var.NODE_ENV}",
    "MONGO_URI=${var.MONGO_URI}",
    "REDIS_HOST=${var.REDIS_HOST}"
  ]

  volumes {
    host_path      = abspath("${path.module}/../backend")
    container_path = "/app"
  }

  volumes {
    volume_name    = docker_volume.static_files.name
    container_path = "/app/static"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.db]
}

# Contenedor de la base de datos (MongoDB)
resource "docker_container" "db" {
  name  = "mongo_db_1"
  image = "mongo:latest"

  ports {
    internal = 27017
    external = 27017
  }

  env = [
    "MONGO_INITDB_ROOT_USERNAME=${var.MONGO_INITDB_ROOT_USERNAME}",
    "MONGO_INITDB_ROOT_PASSWORD=${var.MONGO_INITDB_ROOT_PASSWORD}",
    "MONGO_INITDB_DATABASE=${var.MONGO_INITDB_DATABASE}",
  ]

  volumes {
    volume_name    = docker_volume.mongo_data.name
    container_path = "/data/db"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# Contenedor de la caché (Redis) - Solo en producción
resource "docker_container" "cache" {
  name  = "cache"
  image = "redis:alpine"

  ports {
    internal = 6379
    external = 6379
  }

  env = [
    "ALLOW_EMPTY_PASSWORD=yes"
  ]

  cpu_shares = var.NODE_ENV == "production" ? 512 : 256
  memory     = var.NODE_ENV == "production" ? 1024 : 512

  volumes {
    volume_name    = docker_volume.cache_data.name
    container_path = "/data"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.backend]

  count = var.NODE_ENV == "production" ? 1 : 0
}

# Imagen de Nginx
resource "docker_image" "nginx_image" {
  name = "custom-nginx"

  build {
    path       = path.module
    dockerfile = "${path.module}/config/Dockerfile.nginx"
  }

  lifecycle {
    create_before_destroy = false
    prevent_destroy       = true
  }
}

# Lista de servidores basada en el número de instancias
locals {
  upstream_servers = join(" ", [
    for i in range(var.INSTANCE_COUNT) : "server web_app_${i + 1}:3000;"
  ])
}

# Contenedor de Nginx para el balanceador de carga
resource "docker_container" "nginx_lb" {
  name  = "nginx_lb"
  image = docker_image.nginx_image.name

  ports {
    internal = 80
    external = 80
  }

  env = [
    "UPSTREAM_SERVERS=${local.upstream_servers}"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.web_app]
}

resource "docker_volume" "prometheus_data" {
  name = "prometheus_data"
}
resource "docker_image" "prometheus" {
  name = "prom/prometheus:latest"
}

resource "docker_container" "prometheus" {
  image = docker_image.prometheus.name
  name  = "prometheus"

  ports {
    internal = 9090
    external = 9090
  }

  volumes {
    host_path      = abspath("${path.module}/config/prometheus.yml")
    container_path = "/etc/prometheus/prometheus.yml"
  }

  volumes {
    host_path      = abspath("${path.module}/config/alert.rules.yml")
    container_path = "/etc/prometheus/alert.rules.yml"
  }

  volumes {
    container_path = "/prometheus"
    volume_name    = docker_volume.prometheus_data.name
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

resource "docker_volume" "grafana_data" {
  name = "grafana_data"
}

resource "docker_image" "grafana" {
  name = "grafana/grafana:latest"
}

resource "docker_container" "grafana" {
  image = docker_image.grafana.name
  name  = "grafana"

  ports {
    internal = 3000
    external = 3000
  }

  env = [
    "GF_SECURITY_ADMIN_USER     = admin",
    "GF_SECURITY_ADMIN_PASSWORD = admin",
  ]

  volumes {
    container_path = "/var/lib/grafana"
    volume_name    = docker_volume.grafana_data.name
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.prometheus]
}

resource "docker_volume" "loki_data" {
  name = "loki_data"
}

resource "docker_image" "loki" {
  name = "grafana/loki:latest"
}

resource "docker_container" "loki" {
  image = docker_image.loki.name
  name  = "loki"

  ports {
    internal = 3100
    external = 3100
  }

  volumes {
    container_path = "/loki"
    volume_name    = docker_volume.loki_data.name
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

resource "docker_image" "promtail" {
  name = "grafana/promtail:latest"
}

resource "docker_container" "promtail" {
  image = docker_image.promtail.name
  name  = "promtail"

  volumes {
    host_path      = "/var/lib/docker/containers"
    container_path = "/var/lib/docker/containers"
    read_only      = true
  }

  volumes {
    host_path      = abspath("${path.module}/config/promtail-config.yml")
    container_path = "/etc/promtail/config.yml"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.loki]
}

resource "docker_image" "alertmanager" {
  name = "prom/alertmanager:latest"
}

resource "docker_container" "alertmanager" {
  image = docker_image.alertmanager.name
  name  = "alertmanager"

  ports {
    internal = 9093
    external = 9093
  }

  volumes {
    host_path      = abspath("${path.module}/config/alertmanager.yml")
    container_path = "/etc/alertmanager/alertmanager.yml"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.prometheus]
}
