# Install Jenkins in Docker Container with SSL

## Project Directory Structure
```
/jenkins
    Dockerfile
    /certs
        cert-key.pem
        fullchain.pem
    nginx.conf
    start.sh
```

## Generate SSL
How about generating a Self-Signed SSL Certificate? Please check at [Create a Valid Self-Signed SSL Certificate](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/ssl-self-signed-certificate)

## Jenkins Image with Nginx as Proxy
```dockerfile
FROM jenkins/jenkins:2.479.3-jdk17

# Update dan install nginx menggunakan apt-get
USER root
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Menyalin sertifikat SSL ke dalam container
COPY ./certs /etc/nginx/certs

# Menyalin file konfigurasi Nginx yang telah disesuaikan
COPY ./nginx.conf /etc/nginx/nginx.conf

# Menyalin skrip start.sh untuk menjalankan registry dan nginx
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

# Membuka port 443 untuk Nginx (HTTPS) dan 8080 untuk Jenkins (HTTP)
EXPOSE 443 8080

# Menjalankan skrip start.sh yang akan menjalankan Nginx dan Jenkins
CMD ["/start.sh"]
```

## nginx.conf
```
events {
    worker_connections 1024;  # Jumlah koneksi maksimum per worker
}

http {
    server {
        listen 80;
        server_name jenkins.sintek.com;

        # Redirect HTTP ke HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name jenkins.sintek.com;

        # Sertifikat SSL
        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/cert-key.pem;
        ssl_trusted_certificate /etc/nginx/certs/fullchain.pem;

        ssl_protocols TLSv1.1 TLSv1.2;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;

        # Konfigurasi untuk mengatur proxy ke Jenkins
        location / {
            proxy_pass http://127.0.0.1:8080;  # Akses ke Jenkins di localhost:8080
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## start.sh
```bash
#!/bin/sh

# Mulai Jenkins di background, pastikan hanya mendengarkan di localhost
echo "Starting Jenkins..."
java -jar /usr/share/jenkins/jenkins.war --httpListenAddress=127.0.0.1 --httpPort=8080 &

# Menunggu Jenkins siap (opsional, menunggu 30 detik)
sleep 30

# Mulai Nginx
echo "Starting Nginx..."
nginx -g 'daemon off;'
```

## Build Image
```bash
$ sudo docker build -t jenkins-proxy .

# Optional
# $ sudo docker build -t jenkins-proxy . --network=host
```

## Run Image as a Docker Container
Run image with static IP Address with docker network ipvlan. [In this section](https://github.com/anang5u/scalable-microservices-deployment-and-monitoring/tree/main/docker-network) is about creating docker network ipvlan
```bash
$ sudo docker run -d \
  -p 80:80 -p 443:443 \
  --name jenkins-ssl \
  --volume jenkins-data:/var/jenkins_home \
  --net ipvlan-network \
  --ip 10.50.0.210 \
  jenkins-proxy

# Check logs unlock jenkins
$ sudo docker log <container-name>

# check log nginx
$ tail -f /var/log/nginx/error.log

# ssl certificates info
$ openssl x509 -in /etc/nginx/certs/fullchain.pem -noout -text
```

### Create Virtual Hosts in Windows
```
located at:
c:\Windows\System32\Drivers\etc\hosts

10.50.0.210 jenkins.sintek.com
```

![jenkins-ssl](jenkins-ssl.png)

Docker image:<br>
https://hub.docker.com/r/jenkins/jenkins/tags

Official Doc:<br>
https://www.jenkins.io/doc/book/installing/
