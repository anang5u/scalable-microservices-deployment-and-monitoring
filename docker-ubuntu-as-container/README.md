## Setting Up SSH Access for Ubuntu in a Docker Container

The steps to configure SSH for remote access to an Ubuntu system running inside a Docker container. This includes installing SSH and setting up public keys to enable SSH connections to the container.

### Pull the Ubuntu Image Latest
```bash
$ sudo docker pull ubuntu
```

### Run an ssh Server within a Container
https://dev.to/s1ntaxe770r/how-to-setup-ssh-within-a-docker-container-i5i

The Dockerfile
```docker
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y openssh-server sudo net-tools vim iputils-ping

# Buat pengguna baru dengan home di /home/test dan tanpa menetapkan UID secara manual
RUN useradd -m -d /home/test -s /bin/bash -G sudo test

RUN echo 'test:test' | chpasswd

# Add test user to sudoers to skip sudo password asking
RUN echo 'test ALL=(ALL) NOPASSWD: ALL' | tee -a /etc/sudoers

RUN service ssh start

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]

```

### Build Image and Run Ubuntu Container
Build image (ubuntu with ssh) and start a new Ubuntu container in detached mode (in the background) with an interactive terminal and static IP 10.50.0.101. [See how to set up Docker Network with the IPvlan driver and static IP](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/docker-network)
```bash
## Build image ubuntu with ssh
## docker build -t IMAGE_NAME .
$ sudo docker build -t ubuntu1 .

## Run the image
$ sudo docker run -itd -p 22:22 \
    --name node1 \
    --net ipvlan-network \
    --ip 10.50.0.101 ubuntu1
```

### Enter the Container
```bash
$ sudo docker exec -it node1 /bin/bash

$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
    inet 10.50.0.101  netmask 255.255.254.0  broadcast 10.50.1.255
    ...
```

### Try Connect SSH with password
```bash
$ ssh test@10.50.101
test@10.50.0.101's password:
```

## SSH Key Pair

### Generate SSH Key Pair with Custom Name Key
```bash
# Windows PowerShell
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f C:\Users\YourUsername\.ssh\my_custom_key

# Linux ubuntu
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/my_custom_key

Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\USERNAME\.ssh\my_custom_key
Your public key has been saved in C:\Users\USERNAME\.ssh\my_custom_key.pub
The key fingerprint is:
SHA256:cRu4fCB3GEJZeGLudX57ueRMslPOl+auNKKmdPS4rR4 your_email@example.com
The key's randomart image is:
+---[RSA 4096]----+
|     .o+o        |
|      =..+       |
|     o.o* +      |
|      .+.*.o     |
|     . .S+o      |
|      . ..+ . .  |
|       . E +.Bo..|
|      . ..= =B*o.|
|       .+=...+O= |
+----[SHA256]-----+
```

### Copy Public Key to Server
```bash
$ ssh-copy-id -i C:\Users\USERNAME\.ssh\my_custom_key.pub user@10.50.0.101

## Copy manual
## Windows PowerShell
$ type C:\Users\USERNAME\.ssh\my_custom_key.pub | ssh user@10.50.0.101 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

## Linux Ubuntu
$ cat ~/.ssh/my_custom_key.pub | ssh user@10.50.0.101 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
```

### Try login with SSH Key
```bash
$ ssh -i C:\Users\USERNAME\.ssh\my_custom_key test@10.50.0.101

Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 5.4.0-31-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

...
```