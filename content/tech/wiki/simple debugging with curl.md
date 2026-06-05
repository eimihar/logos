---
title: simple debugging with curl
date: 2026-06-05
---
```
curl endpoint -vkI
```

-v, --verbose - to display result as verbose
-k, --insecure - to bypass ssl cert checking
-I, --head - to send as HEAD request and skip reading until body

### example
```
curl https://google.com -vkI
```

### response
```
curl https://eimihar.com -vkI
*   Trying 139.59.219.133:443...
* TCP_NODELAY set
* Connected to eimihar.com (139.59.219.133) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=eimihar.com
*  start date: May 16 21:59:00 2026 GMT
*  expire date: Aug 14 21:58:59 2026 GMT
*  issuer: C=US; O=Let's Encrypt; CN=R12
*  SSL certificate verify ok.
> HEAD / HTTP/1.1
> Host: eimihar.com
> User-Agent: curl/7.68.0
> Accept: */*
> 
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
HTTP/1.1 200 OK
< Server: nginx/1.18.0 (Ubuntu)
Server: nginx/1.18.0 (Ubuntu)
< Date: Fri, 05 Jun 2026 07:24:55 GMT
Date: Fri, 05 Jun 2026 07:24:55 GMT
< Content-Type: text/html
Content-Type: text/html
< Content-Length: 27852
Content-Length: 27852
< Last-Modified: Thu, 04 Jun 2026 05:42:22 GMT
Last-Modified: Thu, 04 Jun 2026 05:42:22 GMT
< Connection: keep-alive
Connection: keep-alive
< ETag: "6a21103e-6ccc"
ETag: "6a21103e-6ccc"
< Accept-Ranges: bytes
Accept-Ranges: bytes

< 
* Connection #0 to host eimihar.com left intact
```