# Install Postgres 16 in Ubuntu 22.04

This step-by-step guide explains how to install PostgreSQL 16 on an Ubuntu 22.04 server. PostgreSQL is a powerful, open-source relational database management system (RDBMS) widely used for managing large-scale data applications. Installing PostgreSQL 16 ensures a reliable and scalable database solution, offering advanced features, high performance, and strong data integrity for demanding applications.

## Step 1 - Add PostgreSQL Repository
```bash
# update the package index and install required packages
$ sudo apt update
$ sudo apt install gnupg2 wget nano

# Add the PostgreSQL 16 repositor
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key
$ curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg

# Update the package list
$ sudo apt update
```

## Step 2 - Install PostgreSQL 16

```bash
# Install PostgreSQL 16 and contrib modules
$ sudo apt install postgresql-16 postgresql-contrib-16

# Start and enable PostgreSQL service
$ sudo systemctl start postgresql
$ sudo systemctl enable postgresql

# Check the version and ensure it's Postgresql 16
$ psql --version
psql (PostgreSQL) 16.6 (Ubuntu 16.6-1.pgdg22.04+1)
```

## Step 3 - Configure PostgreSQL 16
```bash
# Edit postgresql.conf to allow remote connections by changing listen_addresses to *
$ sudo vi /etc/postgresql/16/main/postgresql.conf

# change listen_addresses to *
listen_addresses = '*'

# Configure PostgreSQL to use md5 password authentication by editing pg_hba.conf , this is important if you wish to connect remotely e.g. via PGADMIN
$ sudo sed -i '/^host/s/ident/md5/' /etc/postgresql/16/main/pg_hba.conf
$ sudo sed -i '/^local/s/peer/trust/' /etc/postgresql/16/main/pg_hba.conf
$ echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf

# Restart PostgreSQL for changes to take effect
$ sudo systemctl restart postgresql

# Allow PostgreSQL port through the firewall
$ sudo ufw allow 5432/tcp
```

## Step 4 - Connect to PostgreSQL
```bash
# Connect as the postgres user
$ sudo -u postgres psql

# Set a password for postgres user
psql (16.6 (Ubuntu 16.6-1.pgdg22.04+1))
Type "help" for help.

postgres=# ALTER USER postgres PASSWORD 'P@ssw0rd';
ALTER ROLE
postgres=# 
```

Source:<br>
https://dev.to/johndotowl/postgresql-16-installation-on-ubuntu-2204-51ia