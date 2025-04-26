## Simple Automation for Linux Servers with Ansible

This guide outlines setting up simple automation for Linux servers (Ubuntu) using Ansible. It involves installing Ansible on a server, Generate SSH keys, and using SSH key authentication for secure login without a password. After generating SSH keys on the ansible_server, configure the inventory and Ansible settings to automate tasks like pinging remote servers securely with SSH keys. The setup includes a master and nodes, each with distinct IP addresses.

| Name          | IP Address    | Group  |
| ------------- |:-------------:| ------:|
| ansible_server| 10.50.0.102   |        |
| master        | 10.50.0.199   | Master |
| node1         | 10.50.0.201   | Nodes  |
| node2         | 10.50.0.202   | Nodes  |

## Install Ansible
https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html#installing-ansible-on-ubuntu

Configure the PPA on system and install Ansible

```bash
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo add-apt-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```

Check installation
```bash
$ ansible --version

ansible [core 2.17.7]
  config file = /etc/ansible/ansible.cfg
  ...
  python version = 3.12.3
  jinja version = 3.1.2
  libyaml = True
```
Test Automation Ubuntu Server
```bash
$ mkdir /home/test/ansible
$ cd /home/test/ansible

$ sudo vi ansible.cfg
```

```bash
# ansible.cfg
[defaults]
inventory=inventory
host_key_checking = False
interpreter_python = /usr/bin/python3.12
```

```bash
$ sudo vi inventory
```

```bash
# inventory
[master]
10.50.0.199

[nodes]
10.50.0.201
10.50.0.202

[master:vars]
ansible_ssh_user=test
ansible_ssh_pass=test
ansible_become_pass=test

[nodes:vars]
ansible_ssh_user=test
ansible_ssh_pass=test
ansible_become_pass=test
```

Ping ther servers with ansible:
```bash
# ansible master -m ping
# ansible nodes -m ping
$ ansible all -m ping

10.50.0.199 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
10.50.0.201 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
10.50.0.202 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Check Ubuntu Release Version:
```bash
$ ansible master -m shell -a "lsb_release -a"

10.50.0.199 | CHANGED | rc=0 >>
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.1 LTS
Release:        24.04
Codename:       noble
```

### Ansible Playbooks
Install net-tools

```bash
$ sudo vi install_nettools.yaml
```

```yaml
# install_nettools.yaml
---
- hosts: master
  become: yes
  tasks:
     - name: install net-tools
       apt:
          name: net-tools
```

```bash
$ ansible-playbook install_nettools.yaml

PLAY [master] *************************************************************************************************************

TASK [Gathering Facts] ****************************************************************************************************
ok: [10.50.0.199]

TASK [install net-tools] **************************************************************************************************
ok: [10.50.0.199]

PLAY RECAP ****************************************************************************************************************
10.50.0.199                : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### Authentication with SSH private/public keys 

Login into `ansible_server`, generate SSH private/public keys:
```bash
$ ssh-keygen -t rsa -b 4096 -C "anang.su13@example.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /root/.ssh/id_rsa
Your public key has been saved in /root/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:mn2Ncl6DA7HeuZrS8ykKlQJqjU3in4LKQ/ySoYgbSc0 anang.su13@example.com
The key's randomart image is:
+---[RSA 4096]----+
|                 |
|                 |
| ...    .        |
|..O.   . o       |
|o= E. o S        |
|+=. .o = o =     |
|O.+o. o.+ O +    |
|*=.. .. +* = .   |
|ooo   .oo==      |
+----[SHA256]-----+
```

Change sudoers to `NOPASSWD: ALL` with absible playbook for each servers:
```bash
$ cat /etc/sudoers

...
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
...
```


```bash
$ sudo vi add_public_keys.yaml
```

```yaml
# add_public_keys.yaml
---
- hosts: master
  become: yes
  tasks:
     - name: install public keys
       ansible.posix.authorized_key:
          user: test
          state: present
          key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"

     - name: change sudoers file
       ansible.builtin.lineinfile:
          path: /etc/sudoers
          state: present
          regexp: '^%sudo'
          line: '%sudo ALL=(ALL) NOPASSWD: ALL'
          validate: /usr/sbin/visudo -cf %s

- hosts: nodes
  become: yes
  tasks:
     - name: install public keys
       ansible.posix.authorized_key:
          user: test
          state: present
          key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"

     - name: change sudoers file
       ansible.builtin.lineinfile:
          path: /etc/sudoers
          state: present
          regexp: '^%sudo'
          line: '%sudo ALL=(ALL) NOPASSWD: ALL'
          validate: /usr/sbin/visudo -cf %s
```
```bash
$ ansible-playbook add_public_keys.yaml

...
PLAY RECAP ****************************************************************************************************************
10.50.0.199                : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
10.50.0.201                : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
10.50.0.202                : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Change Ansible config and inventory

```bash
# ansible.cfg
[defaults]
inventory=inventory
interpreter_python = /usr/bin/python3.12
```

```bash
# inventory
[master]
10.50.0.199

[nodes]
10.50.0.201
10.50.0.202

[master:vars]
ansible_ssh_user=test
ansible_ssh_private_key_file=~/.ssh/id_rsa

[nodes:vars]
ansible_ssh_user=test
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

Try ping servers with SSH key:

```bash
$ ansible all -m ping

10.50.0.199 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
10.50.0.201 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
10.50.0.202 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

https://www.youtube.com/watch?v=uR1_hlHxvhc&t=364s