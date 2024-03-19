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
        - [ ] CF Worker: Strava activity webhook to D1 (or cron pull).
        - [ ] CF R2: Backup Strava .fit files to R2. (Later)
    - API
        - [ ] CF Pages Function: /home
        - [ ] CF pages Function: /query
        - [ ] CF pages Function: /webhook (auth and import)
- Frontend
    - Project
        - [x] Init: React + Tailwind + ReactMapGL
    - Components
        - [ ] Map: Routes + Heatmap + Animating Route + Markers.
        - [ ] Dashboard: User info.
        - [ ] Dashboard: Summary data chart.
        - [ ] Dashboard: Recent activites.
        - [ ] Dashboard: Personal bests.
        - [ ] Dashboard: Aerobic analytics.
        - [ ] Dashboard: Anaerobic analytics.
        - [ ] Dashboard: Custom query.
        - [ ] Detail: Detail info page. (Depends on .fit file from R2)
    - App
        - [ ] API Requests.
        - [ ] Data binding to components.
    - Others
        - [ ] I18N.
        - [ ] Dark Mode.
        - [ ] Privacy mode.
        - [ ] PWA.
- Deployment
    - Serverless
        - [ ] CF Pages & Workers.
