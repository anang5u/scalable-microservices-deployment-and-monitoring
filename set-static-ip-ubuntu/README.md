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

## Using an Alternative Method
For example, given the following configuration of your home network:

```
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::e363:3ddd
   IPv4 Address. . . . . . . . . . . : 10.50.0.175
   Subnet Mask . . . . . . . . . . . : 255.255.254.0
   Default Gateway . . . . . . . . . : 10.50.0.1
```

To configure a Static IP on an Ubuntu 20.04 server according to the network configuration above, follow these steps:

### Identify the Network Interface
To find the network interface in use, run the following command:
```bash
$ ip a
```

Find the name of the interface used for the network connection (for example, eth0, ens33 or another interface name)

### Edit the Netplan Configuration
```bash
$ sudo nano /etc/netplan/00-installer-config.yaml
```
Configuration file:
```yaml
## 00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:  # Gantilah dengan nama interface yang sesuai
      dhcp4: false
      addresses:
        - 10.50.0.100/23  # Alamat IP dengan subnet mask 255.255.254.0 (ini adalah /23)
      gateway4: 10.50.0.1  # Default Gateway
      nameservers:
        addresses:
          - 8.8.8.8  # DNS server, bisa disesuaikan dengan DNS yang Anda inginkan
          - 8.8.4.4
```

Explanation:
```
addresses: Sets the static IP address to be used by the VM (in this case, 10.50.0.100/23).
gateway4: Specifies the default gateway IP address (in this case, 10.50.0.1).
nameservers: Specifies the DNS addresses used. You can use Google's DNS (8.8.8.8 and 8.8.4.4) or other DNS servers as needed.
```

### Apply the Configuration
Once you've finished editing the file, save and exit the text editor. If you're using nano, press Ctrl + O to save, then Ctrl + X to exit.

Now, apply the configuration you created by running the following commands:

```bash
$ sudo netplan try
$ sudo netplan apply
```

After applying the configuration, check if the static IP has been successfully applied and if you can connect to the network by running the following command:

```bash
$ ip a
```

Ensure that the IP address 10.50.1.100 has been applied to the appropriate network interface.

Also, verify that you can connect to the gateway and DNS by running the following ping commands:

```bash
$ ping 10.50.0.1  # Ping to the gateway
$ ping 8.8.8.8    # Ping to Google DNS
```

If all steps are successful, your Ubuntu 20.04 network will be using the static IP address as per the configuration you have set.

Try ping and connect via ssh from host:
```ruby
$ ping 10.50.0.100

Pinging 10.50.0.100 with 32 bytes of data:
Reply from 10.50.0.100: bytes=32 time=1ms TTL=64
Reply from 10.50.0.100: bytes=32 time=1ms TTL=64
Reply from 10.50.0.100: bytes=32 time=1ms TTL=64

$ ssh vagrant@10.50.0.100

ssh vagrant@10.50.0.100
vagrant@10.50.0.100's password:
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-31-generic x86_64)
...
```

Troubleshooting:
```
$ ssh vagrant@192.168.1.8
vagrant@192.168.1.8: Permission denied (publickey).

[Solve] try ssh with specific path/to/private_key:
$ ssh -i .vagrant\machines\serverhome1\virtualbox\private_key vagrant@10.50.0.100
````