# Monitoring PostgreSQL 16 with Prometheus and Grafana on Ubuntu 22.04

This guide explains how to monitor PostgreSQL 16 on Ubuntu 22.04 using Prometheus and Grafana. By integrating these tools, you can collect, store, and visualize PostgreSQL metrics in real time, enabling effective performance monitoring, troubleshooting, and optimization of your database

## PostgreSQL Server Configuration
Set up PostgreSQL to use 'scram-sha-256' password encryption for enhanced security.

```bash
$ cd /etc/postgresql/16/main/

# postgresql.conf
$ sudo nano postgresql.conf
```

Uncomment the option 'password_encryption' and change the value to 'scram-sha-256':
```bash
password_encryption = scram-sha-256     # scram-sha-256 or md5
```

Next, open the 'pg_hba.conf' file using the editor. This file defines password authentication methods for hosts or IP addresses:
```ruby
# pg_hba.conf
$ sudo nano pg_hba.conf

# "local" is for Unix domain socket connections only
local   all          all                            peer
# IPv4 local connections:
host    all          all       127.0.0.1/32         scram-sha-256
# IPv6 local connections:
host    all          all        ::1/128             scram-sha-256
```

Restart the PostgreSQL service:
```bash
$ sudo systemctl restart postgresql
```

## Downloading postgres_exporter

Create a new system user 'postgres_exporter' on your PostgreSQL server
```bash
$ sudo useradd -M -r -s /sbin/nologin postgres_exporter
```

Download the 'postgres_exporter'<br>
```bash
# Download postgres_exporter
# See for latest version
# https://github.com/prometheus-community/postgres_exporter
$ wget https://github.com/prometheus-community/postgres_exporter/releases/download/v0.16.0/postgres_exporter-0.16.0.linux-amd64.tar.gz

# Extract the postgres_exporter package
$ tar xvf postgres_exporter*.tar.gz

# move to the '/opt/postgres_exporter'
$ sudo mv postgres_exporter*/ /opt/postgres_exporter

# See postgres_exporter
$ ls /opt/postgres_exporter
LICENSE  NOTICE  postgres_exporter
```
## Configuring postgres_exporter
```bash
$ cd /opt/postgres_exporter

# Create .env file
$ sudo nano .env
```

Add the following lines to the file. Also, be sure to change the details of the PostgreSQL user, password, and host
```ruby
# Format
#DATA_SOURCE_NAME=postgresql://username:password@localhost:5432/postgres?sslmode=disable

# Monitor all databases via postgres_exporter
DATA_SOURCE_NAME="postgresql://postgres:strongpostgrespassword@localhost:5432/?sslmode=disable"

# Monitor specific databases on the PostgreSQL server
# DATA_SOURCE_NAME="postgresql://username:password@localhost:5432/database-name?sslmode=disable"
```

Next, run the below chown command to change the ownership of the '/opt/postgres_exporter' directory to the user 'postgres_exporter'

```bash
$ sudo chown -R postgres_exporter: /opt/postgres_exporter
```

After that, run the below command to create a new systemd service file '/etc/systemd/system/postgres_exporter.service'. With this, you can easily manage the 'postgres_exporter' via the systemctl command utility

```bash
$ sudo tee /etc/systemd/system/postgres_exporter.service<<EOF
[Unit]
Description=Prometheus exporter for Postgresql
Wants=network-online.target
After=network-online.target

[Service]
User=postgres_exporter
Group=postgres_exporter
WorkingDirectory=/opt/postgres_exporter
EnvironmentFile=/opt/postgres_exporter/.env
ExecStart=/opt/postgres_exporter/postgres_exporter --web.listen-address=:9187 --web.telemetry-path=/metrics
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```
Now run the below systemctl command to reload the systemd manager and apply the changes
```bash
$ sudo systemctl daemon-reload
```

After the systemd manager is reloaded, start and enable the 'postgres_exporter' service via the systemctl command utility below

```bash
$ sudo systemctl start postgres_exporter
$ sudo systemctl enable postgres_exporter
```

```bash
$ sudo systemctl status postgres_exporter
● postgres_exporter.service - Prometheus exporter for Postgresql
     Loaded: loaded (/etc/systemd/system/postgres_exporter.service; enabled; vendor preset: >
     Active: active (running) since Fri 2024-12-06 17:00:14 UTC; 26s ago
   Main PID: 6595 (postgres_export)
      Tasks: 4 (limit: 2221)
     Memory: 1.6M
        CPU: 9ms
     CGroup: /system.slice/postgres_exporter.service
             └─6595 /opt/postgres_exporter/postgres_exporter --web.listen-address=:9187 --we>
...
```
Lastly, open your web browser and visit your PostgreSQL server IP address followed by the 'postgres_exporter' port 9187 (i.e: http://192.168.51.15:9187/metrics).

You should see the details of PostgreSQL server metrics gathered by the 'postgres_exporter':

```
# HELP go_gc_duration_seconds A summary of the wall-time pause (stop-the-world) duration in garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 0
go_gc_duration_seconds{quantile="0.25"} 0
go_gc_duration_seconds{quantile="0.5"} 0
go_gc_duration_seconds{quantile="0.75"} 0
go_gc_duration_seconds{quantile="1"} 0
go_gc_duration_seconds_sum 0
go_gc_duration_seconds_count 0
# HELP go_gc_gogc_percent Heap size target percentage configured by the user, otherwise 100. This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function. Sourced from /gc/gogc:percent
# TYPE go_gc_gogc_percent gauge
go_gc_gogc_percent 100
...
```

![postgres_exporter_metrics](postgres_exporter_metrics.png)

Next, we will try to integrate postgres_exporter with Prometheus and Grafana

Source:<br>
https://www.howtoforge.com/how-to-monitor-postgresql-with-prometheus-and-grafana/