# Wanderlust
Explore the world on foot.

***

TODOs
- Backend
    - Data
        - [x] ~~CF D1: Database tables design.~~ Use KV instead.
        - [x] ~~CF D1 / R2: Fetch from Strava and import to D1.~~ Use KV instead.
    - API
        - [x] CF Pages Function: /strava/auth
        - [x] CF Pages Function: /strava/sync
        - [x] CF Pages Function: /config
        - [ ] CF Pages Function: /home
        - [ ] CF pages Function: /query
- Frontend
    - Project
        - [x] Init: React + Tailwind + ReactMapGL
    - Components / Pages
        - [ ] Map: Routes + Heatmap + Animating Route + Markers.
        - [ ] Config: Auth + Sync + Config Editor.
        - [ ] Dashboard: Custom query.
        - [ ] Dashboard: User info.
        - [ ] Dashboard: Summary data chart.
        - [ ] Dashboard: Recent activites.
        - [ ] Dashboard: Personal bests.
        - [ ] Dashboard: Aerobic analytics.
        - [ ] Dashboard: Anaerobic analytics.
        - [ ] Dashboard: Custom query.
        - [ ] Detail: Detail info page. (Depends on .fit file from R2)
    - Nice To Have
        - [ ] Configurable dashboard card templates.
        - [ ] I18N.
        - [ ] Dark Mode.
        - [ ] Privacy mode.
        - [ ] PWA.
        - [ ] AIGC (training performance evaluation?).
- Deployment
    - Serverless
        - [x] CF Pages & Functions & Workers.
