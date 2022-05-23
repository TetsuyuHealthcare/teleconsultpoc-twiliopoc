# DP-Tele-Consultation (Backend)

Backend for video call app with twilio service.

## Setup

- Add environment variables
```bash
  $ cp .env.example .env
```

- Install packages
```bash
  $ yarn install
```

- Run migration
```bash
  $ yarn typeorm migration:run
```

- Run seed:
```bash
  $ yarn seed:run
```

- Start dev server
```bash
  $ redis-server # start local redis server

  $ yarn start # without watch mode
  $ yarn start:dev # with watch mode
```

## Deploy heroku
```bash
  $ cd ..
  $ git push heroku-be `git subtree split --prefix backend master`:master
```
