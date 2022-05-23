# DP-Tele-Consultation (Frontend)

Frontend for video call app with twilio service.

## Setup

- Add environment variables
```bash
  $ cp .env.example .env
```

- Install packages
```bash
  $ yarn install
```

- Start dev server
```bash
  $ yarn start:dev
```

## Deploy heroku
```bash
  $ cd ..
  $ git push heroku-fe `git subtree split --prefix frontend master`:master
```
