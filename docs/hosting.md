# Хостинг

Сайт — статика на своём сервере (`130.49.174.192`, nginx), общем с fafn.ru и isomantika.com. CI на push в `main`
проверяет и собирает сайт, затем отправляет `dist/apps/site/browser/` rsync в `/var/www/karmanto.com` (`--delete`).
Конфиг nginx — [`deploy/nginx/karmanto.com.conf`](../deploy/nginx/karmanto.com.conf), сертификат — Let's Encrypt
(certbot). `www.karmanto.com`, `karmanto.ru` и `www.karmanto.ru` — 301 на `https://karmanto.com$request_uri`.
Docker на сервере не нужен: им только проверяют конфиг локально (ниже).

## Секреты репозитория (Settings → Secrets and variables → Actions)

| Секрет           | Значение                         |
| ---------------- | -------------------------------- |
| `DEPLOY_HOST`    | `130.49.174.192`                 |
| `DEPLOY_PORT`    | `61088`                          |
| `DEPLOY_USER`    | `developer`                      |
| `DEPLOY_SSH_KEY` | приватный ключ `karmanto-deploy` |
| `DEPLOY_PATH`    | `/var/www/karmanto.com`          |

Пока секретов нет, job `deploy` на `main` падает, проверки — проходят.

## DNS (reg.ru)

Оба домена — у reg.ru, NS не меняем. Записи заглушки reg.ru (`A`/`AAAA` на его адреса) удалить.

| Домен          | Имя                      | Тип   | Значение                                |
| -------------- | ------------------------ | ----- | --------------------------------------- |
| `karmanto.com` | `@`                      | A     | `130.49.174.192` (без `AAAA`: нет IPv6) |
| `karmanto.com` | `www`                    | CNAME | `karmanto.com.`                         |
| `karmanto.com` | `@`                      | MX    | `mx1.improvmx.com.`, приоритет 10       |
| `karmanto.com` | `@`                      | MX    | `mx2.improvmx.com.`, приоритет 20       |
| `karmanto.com` | `@`                      | TXT   | `v=spf1 include:spf.improvmx.com ~all`  |
| `karmanto.com` | `dkimprovmx1._domainkey` | CNAME | `dkimprovmx1.improvmx.com.`             |
| `karmanto.com` | `dkimprovmx2._domainkey` | CNAME | `dkimprovmx2.improvmx.com.`             |
| `karmanto.com` | `_dmarc`                 | TXT   | `v=DMARC1; p=reject;`                   |
| `karmanto.ru`  | `@`                      | A     | `130.49.174.192`                        |
| `karmanto.ru`  | `www`                    | CNAME | `karmanto.ru.`                          |

Записи DKIM сверить с теми, что покажет ImprovMX. Проверка: `dig +short karmanto.com`, `dig +short www.karmanto.ru`
(адрес сервера), `dig +short MX karmanto.com`.

## Почта `support@karmanto.com` — ImprovMX

Как у isomantika.com, платный тариф. В ImprovMX: Add domain `karmanto.com`, алиас `support` → личная почта
владельца; дождаться зелёных проверок. Отправлять письма от адресов домена — только через SMTP ImprovMX (иначе
DMARC `p=reject` их отклонит). У `karmanto.ru` почты нет.

## Первая настройка сервера

Ubuntu 24.04, nginx из `conf.d`, certbot с `certbot.timer`. Вход по SSH — порт 61088; деплоит пользователь
`developer`, у CI сайта свой ключ `karmanto-deploy`.

1. Папка сайта: `sudo install -d -o developer -g developer /var/www/karmanto.com`.
2. Ключ CI: `ssh-keygen -t ed25519 -N '' -C karmanto-deploy -f karmanto-deploy`; публичный ключ — строкой в
   `/home/developer/.ssh/authorized_keys`, приватный — в секрет `DEPLOY_SSH_KEY`, файлы ключа потом удалить.
3. DNS — таблица выше. Дождаться, пока все четыре имени отдают адрес сервера.
4. Сертификат на четыре имени:
   `sudo certbot certonly --nginx -d karmanto.com -d www.karmanto.com -d karmanto.ru -d www.karmanto.ru`.
   Продлевает `certbot.timer`.
5. Конфиг: `deploy/nginx/karmanto.com.conf` → `/etc/nginx/conf.d/karmanto.com.conf`,
   `sudo nginx -t && sudo systemctl reload nginx`.
6. Перезапустить последний CI на `main` (или смёржить PR) — сайт приедет на сервер.
7. Проверить: `https://karmanto.com/` открывается; `curl -sI http://karmanto.ru/privacy/` и
   `https://www.karmanto.com/` — 301 на `https://karmanto.com/…`.

## Изменение конфига nginx

Конфиг в репозитории — источник правды; на сервер его копируют руками, CI отправляет только файлы сайта.
Перед копированием — проверить локально в Docker с собранным сайтом (`yarn build`): `nginx:1.28`, самоподписанный
сертификат в `/etc/letsencrypt/live/karmanto.com/`, `options-ssl-nginx.conf` и `ssl-dhparams.pem` (2048 бит)
рядом, `nginx -t` и `curl --resolve` по всем четырём именам.
