# Build Docker Image for Golang App and Push into Registry

In this section we learn about how build image for golang app and push it into self hosted image registry. In previous section, we learned about how to seting up about jenkins agent dockerfile

[Jenkins with Dockerfile As Build Agents](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/jenkins-agent-docker-container)

[Self Hosted Docker Image Registry](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/docker-registry)

## Simple Golang API with Go Fiber

### Project Structure
```
go-fiber-app/
│
├── main.go
├── Dockerfile
├── Jenkinsfile
├── go.mod
├── go.sum
└── main_test.go
```