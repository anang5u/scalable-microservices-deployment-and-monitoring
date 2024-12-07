# Scalable Microservices Deployment and Monitoring
This project focuses on deploying, monitoring, and automating scalable microservices using modern DevOps tools, with Database Replication for high availability and fault tolerance

> Vagrant, Ansible, Terraform, Docker, Kubernetes<br>
> Golang <br>
> Message Broker Kafka/RabbitMQ<br>Postgres Database 
> Replication<br>
> Monitoring tools Prometheus/Grafana


## :writing_hand:[Setting Up Multiple Servers Locally Using Vagrant](https://github.com/anang5u/virtualization-and-development-tools/tree/main/multi-server)
The challenges of conducting experiments that require multiple servers, especially when using cloud providers like AWS, Google Cloud, Microsoft Azure, and others. It suggests starting with local experimentation before deploying to actual server environments. The focus is on setting up three servers simultaneously using a Vagrantfile script.

## :writing_hand:[Set Static IP in Ubuntu Server 20.04](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/set-static-ip-ubuntu)

This setup ensures that the server retains the same IP address after rebooting or network changes, making it essential for network stability and remote management.

## :writing_hand:[Install Postgres 16 in Ubuntu 22.04](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/install-postgres-16)

This guide covers installing PostgreSQL 16 on Ubuntu 22.04. PostgreSQL is a powerful, open-source RDBMS ideal for managing large-scale applications, offering reliability, scalability, and strong data integrity.

## :writing_hand:[Monitoring PostgreSQL 16 with Prometheus and Grafana #1](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/postgres16-monitoring)

This section provides a detailed guide on how to install and configure PostgreSQL 16 along with postgres_exporter in Ubuntu 22.04. The section also includes steps for configuring both PostgreSQL and postgres_exporter to ensure proper integration with Prometheus and Grafana for effective monitoring


## :writing_hand:[Monitoring PostgreSQL 16 with Prometheus and Grafana on Ubuntu 22.04 #2](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/postgres16-monitoring)

This session will cover the installation of Prometheus and Grafana on Ubuntu 20.04 (Focal Fossa), along with the setup of a Grafana dashboard for monitoring PostgreSQL 16