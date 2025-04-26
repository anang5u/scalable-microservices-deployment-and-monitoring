# Set Static IP Address on Alpine Linux

We are going to configure a static IP of  192.168.30.200 with the gateway of  192.168.30.1 (The router’s IP address)

## Alpine Linux Version
```bash
$ uname -a
Linux serveralpine1 4.9.73-0-virthardened #1-Alpine SMP Tue Jan 2 16:48:59 UTC 2018 x86_64 Linux
```

## Set IP Address
```bash
# edit interfaces file
$ sudo vi /etc/network/interfaces
```

/etc/network/interfaces:
```
#auto lo
#iface lo inet loopback

#auto eth0
#iface eth0 inet dhcp
#       hostname alpine

auto eth0
iface eth0 inet static
        address 192.168.30.200
        netmask 255.255.255.0
        gateway 192.168.30.1
        hostname alpine
```

## Restart Network
```bash
$ sudo service networking restart

# Check IP Address
$ ip a
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    inet 192.168.30.200/24 scope global eth0

# SSH
$ ssh -i .vagrant\machines\serveralpine1\virtualbox\private_key vagrant@192.168.30.200
```

## Configure DNS
