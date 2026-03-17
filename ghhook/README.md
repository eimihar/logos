# GitHub Webhook Server

Simple Express.js API for handling GitHub webhook push events.

## Development

```bash
npm install
cp .env.example .env
# Edit .env with your webhook secret
npm start
```

## Production Setup with Nginx

### 1. Install Node.js and PM2

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Configure PM2

Create ecosystem file:

```bash
pm2 init
```

Edit `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "github-webhook",
      script: "./index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        WEBHOOK_SECRET: "your_secret_here",
      },
    },
  ],
}
```

Start the app:

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 3. Install and Configure Nginx

```bash
sudo apt install nginx
```

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/github-webhook
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/github-webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 5. Configure GitHub Webhook

1. Go to your repository settings
2. Navigate to Webhooks
3. Add webhook:
   - Payload URL: `https://your-domain.com/webhook`
   - Content type: `application/json`
   - Secret: Enter your `WEBHOOK_SECRET`
   - Events: Select "Pushes"

### 6. Useful PM2 Commands

```bash
pm2 status
pm2 logs github-webhook
pm2 restart github-webhook
pm2 stop github-webhook
```

## Security Notes

- Always use HTTPS in production
- Set a strong `WEBHOOK_SECRET`
- Consider adding signature verification in the webhook handler
- Keep dependencies updated
