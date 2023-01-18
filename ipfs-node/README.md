# Set up an IPFS Node

The Chainlink Oracle External Adapter, used to produce a hash, given an IPFS CID, needs to connect to an IPFS node, with APIs enabled.

You can freely use a node you already have. Here we've written a guide on how to set up an IPFS node with 
private access.

The APIs enabled are:

* [`/api/v0/ls`](https://docs.ipfs.tech/reference/kubo/rpc/#api-v0-ls)
* [`/api/v0/files/stat`](https://docs.ipfs.tech/reference/kubo/rpc/#api-v0-files-stat)
* [`/ipfs/{cid}`](https://docs.ipfs.tech/reference/http/gateway/#api)

While the first two endpoints are part of the **Kubo RPC APIs**, the last one is the **HTTP Gateway** built in your IPFS Node.
To simplify, we'll have all these endpoints exposed on the `443` port of our node


## 1. Install Kubo IPFS

* spin up an instance (also in cloud). We've tested `Ubuntu 22.04 LTS` as OS
* `sudo apt update && sudo apt upgrade -y`
* Install binaries ([official instructions](https://docs.ipfs.tech/install/command-line/#install-official-binary-distributions)), making sure to download the correct binary [from here](https://dist.ipfs.tech/#kubo)
* `ipfs init --profile server` to start the node in server mode

You can now decide to add **ipfs** as a service (recommended), or in `screen` mode

### IPFS as a system service

Create the file `/lib/systemd/system/ipfs.service` with the following content

```
[Unit]
Description=IPFS Daemon

[Service]
Type=simple
User=ubuntu
Environment=HOME=/home/ubuntu
Restart=always
ExecStart=/usr/local/bin/ipfs daemon

[Install]
WantedBy=multi-user.target
```

Then type `sudo systemctl start ipfs` to start the service, and `sudo systemctl enable ipfs` to enable auto start at boot.

### IPFS in `screen`

Run the command `screen -d -m ipfs daemon`.

If you want to auto run at start up, you need to create a bash script, and use `crontab` to execute it at start up.

## 2. Certbot and Nginx

We're now going to install Nginx proxy with Certbot to manage https certificates

* Create the domain you want to obtain the certificate, and point it to your machine
* Open port 80 and 443 by configuring your firewall
* `sudo apt-get install certbot python3-certbot-nginx`

Now you can run `sudo certbot --nginx` and follow the instructions to generate your certificate.

Once the procedure is over, substitute the default Nginx configuration `/etc/nginx/sites-enabled/default` with the 
following one

```
server {

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;
        server_name --your-domain--; # managed by Certbot

        location ~ ^(/api/v0/(ls|files\/stat)) {
                proxy_pass http://localhost:5001;
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                if ($http_authorization != '---Secret-header-value---') {
        		return 403;
    		}
        }

        location ~ ^/ipfs/ {
                proxy_pass http://localhost:8080;
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                if ($http_authorization != '---Secret-header-value---') {
        		return 403;
    		}
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/--your-domain--/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/--your-domain--/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = --your-domain--) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80 ;
        listen [::]:80 ;
    server_name --your-domain--;
    return 404; # managed by Certbot
}
```

Replace `--your-domain--` with the domain you're pointing to the machine (example `ipfs.yourdomain.com`).

Replace also `---Secret-header-value---` with a secret key.

In this configuration:

* APIs enabled are only `/api/v0/ls` and `/api/v0/files/stat`
* Proxy connects API on internal port `5001` and `8080` to external port `443`
* To call API or get a file, call the server on port 443
* Calls are all refused, unless the header `Authorization` with value `---Secret-header-value---` is passed along with the request

## 3. Certbot autorenew

Certificates expire after 3 months. Easiest way to add the certbot autorenew:

* execute command `sudo crontab -e` (must be `sudo` otherwise renewal won't work)
* add `0 4 * * * /usr/bin/certbot renew --quiet` line

In this way, the renewal process runs daily 4 AM. If the certificate has less than 30 days, it will be automatically renewed.
