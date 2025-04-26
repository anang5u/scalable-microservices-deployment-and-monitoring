# Setup and Deploy Kubernetes Cluster with Rancher

### Run Rancher server in docker container
```powershell
# volume
$ mkdir volume

# run rancher
$ docker run -d --name rancher-server -v ${PWD}/volume:/var/lib/rancher --restart=unless-stopped -p 8088:80 -p 4443:443 --privileged rancher/rancher

# Unlock rancher
$ docker logs rancher-server > rancher.log
$ docker logs rancher-server  2>&1 | grep "Bootstrap Password:"

# Windows PowerShell
$ docker logs rancher-server 2>&1 | Select-String "Bootstrap Password:"
... [INFO] Bootstrap Password: rhw24qhjd9jqxcmkt876whp9cp7kz8tlgg62zcphdpbl9tvsgvnf9b

# Rancher password
z8KUcNtz74oTjwtP
```

### Server Node-1
```bash
# install docker
# Add Docker's official GPG key:
# https://docs.docker.com/engine/install/ubuntu/
$ sudo apt-get update
$ sudo apt-get install ca-certificates curl
$ sudo install -m 0755 -d /etc/apt/keyrings
$ sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
$ sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update

# To install the latest version, run:
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Create Cluster with Rancher
```
1. Cluster Magement -> Create
2. Custom
    -> Cluster Name : cluster-v1
    -> Labels & Annotations -> key : cluster
    -> Labels & Annotations -> value : v1

````

Alias Sementara (langsung pakai)
Set-Location 'D:\Experiments\Sintek\VAGRANT\scalable-microservices-deployment-and-monitoring\rancher-deploy-kubernetes'


Mempersingkat Tampilan Layar:
function prompt {
    "$([System.IO.Path]::GetFileName($(Get-Location)))> "
}

https://www.youtube.com/watch?v=1j5lhDzlFUM&t=1216s
