# Creation of SSD storage class
module "k8s" {
  source = "./k8s"
}

# Creation of namespaces (prod / pre)
module "environments" {
  source = "./environments"
}

# Deploy production
module "services-production" {
  source    = "./services"
  namespace = "${module.environments.prod-namespace}"
  chain     = "${var.chain}"
}

# Creation of external ingresses to access the cluster
module "ingress" {
  source = "./ingress"

  domain             = "${var.domain}"
  api_subdomain_name = "${var.api_subdomain_name}"
  email              = "${var.email}"
}
