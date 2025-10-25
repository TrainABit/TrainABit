### Hi there 👋

I'm just starting out in the world of development and currently, I'm a student learning new things every day. Here's a bit about what I'm up to:

- 🔭 I’m currently working on an exciting project: a personalized daily overview application. It integrates a calendar, weather updates, and a personal assistant to help manage your day more efficiently.
- 🌱 I’m currently learning various programming languages and tools to bring my ideas to life. I'm especially focused on frontend and backend development to create user-friendly and functional applications.
- 👯 I’m looking to collaborate with other new developers or anyone who shares a passion for creating useful and innovative tools.
- 🤔 I’m looking for help with advanced programming concepts and best practices in software development.
- 💬 Ask me about my current project or my journey into the world of coding!
- 📫 You can always reach me via LinkedIn
- ⚡ Fun fact: I love combining technology with my other interests to create unique and creative solutions.

Feel free to look around my repositories and don't hesitate to reach out if you want to talk tech, collaborate on a project, or just share some cool coding tips!

Happy coding! 😊

---

## 10M Exit Planner – Model Layer Overview

This repository now includes the foundational data model for the 10M Exit Planner project. Key highlights:

- **Typed domain model** covering plans, milestones, tasks, budgets, KPIs, risks, and resources under the `types/` directory.
- **Derived data helpers** in `lib/` for progress tracking, milestone completion logic, budget summaries, and KPI status counts.
- **Zustand store with localStorage persistence** located at `store/plansStore.ts`, seeded with three strategic plans (Quick Exit, Sustainable Growth, Premium Exit).
- **Seed data** in `data/seed/` with documented assumptions for budgets and KPIs to guide future adjustments.

### Persistence details

- Storage key: `10m-exit-planner-v1`
- Storage version: `1`
- Safe for SSR usage via in-memory fallback when `window.localStorage` is unavailable.

To reset the planner to its default seed data, run the `resetStore` action or clear the storage key in localStorage.

### Smoke test

Run the initialization smoke test to validate seeding and calculations:

```bash
npm run test:store
```

For additional context, see [MODEL_LAYER.md](./docs/MODEL_LAYER.md).
