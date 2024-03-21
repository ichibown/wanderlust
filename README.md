# Wanderlust
Explore the world on foot.

***

TODOs
- Backend
    - Data Sync
        - [x] CF D1: Database tables design.
        - [x] CF D1 / R2: Fetch from Strava and import to D1.
          1. Strava API: auth & token.
          2. Strava API: get all activities.
          3. Wrangler CLI: calclualte fields, generate .sql file, import .sql to D1.
    - API
        - [x] CF Pages Function: /strava/auth
        - [ ] CF Pages Function: /strava/sync
        - [ ] CF Pages Function: /home
        - [ ] CF Pages Function: /config
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
    - Others
        - [ ] I18N.
        - [ ] Dark Mode.
        - [ ] Privacy mode.
        - [ ] PWA.
- Deployment
    - Serverless
        - [ ] CF Pages & Workers.
