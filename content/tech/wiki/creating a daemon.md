---
title: creating a daemon
---
You want to run certain script forever.

1. Create a file called /etc/systemd/system/[service-name].service

```
[Unit]
Description=NGROK tunnel service
After=network.target
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/home/queuemed/bin/ngrok start proxy ssh

[Install]
WantedBy=multi-user.target
```

2. enable the service

```
systemctl enable [service-name]
```

3. start the service

```
systemctl start [service-name]
```