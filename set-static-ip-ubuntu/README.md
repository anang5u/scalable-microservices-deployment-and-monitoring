# Set Static IP in Ubuntu Server 20.04

This setup ensures that the server retains the same IP address after rebooting or network changes, making it essential for network stability and remote management.

```ruby
## copy 01-netcfg.yaml into 01-netcfg.yaml.backup
$ cd /etc/netplan/
vagrant@server2:/etc/netplan$ ls
01-netcfg.yaml

$ sudo cp 01-netcfg.yaml 01-netcfg.yaml.backup
```

Set static IP with 192.168.134.250

```ruby
$ sudo vi 01-netcfg.yaml
```

```ruby
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
     addresses:
       - 192.168.134.250/24
```

Commands https://netplan.io/
```ruby
$ sudo netplan try
$ sudo netplan apply
```

Check IP Address
```ruby
$ ip a

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 5000
    link/ether 08:00:27:12:dd:e0 brd ff:ff:ff:ff:ff:ff
    inet 192.168.134.254/24 brd 192.168.134.255 scope global eth0
       valid_lft forever preferred_lft forever
```

Try connect via ssh:
```ruby
$ ssh vagrant@192.168.134.250
...
vagrant@192.168.134.250's password:
...
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-31-generic x86_64)
```