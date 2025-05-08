
### Website Name: 📝 CRUDit – A Simple Todo App

## Website Description: Website de To-do List
CRUDit is a lightweight, responsive to-do list app that allows users to **Create**, **Read**, **Update**, and **Delete** tasks with ease. It supports offline functionality via a Progressive Web App (PWA) service worker and offers a clean, mobile-friendly UI powered by Bulma CSS.

## 🚀 Features

- Create, edit, and delete todo items
- Toggle completion status with an emoji indicator
- Inline editing and dynamic view switching (List/Grid)
- Live clock display with current date and time
- A dynamic progress bar showing the percentage of completed tasks
- A dynamic and vibrant 'Emoji Meter' that reflects the percentage of completed tasks
- LocalStorage support for view mode preferences
- PWA enabled: offline access and installable
- Responsive UI using [Bulma CSS](https://bulma.io/)
- Deployed via [GitHub Pages](https://cstriker421.github.io/frontend1_project_crudit/)

## 📦 Project Structure

```
crudit/
├── images/
│   ├── 192x192.webp
│   └── 512x512.webp
├── lighthouse-reports/
│   ├── desktop-report.pdf
│   └── mobile-report.pdf
├── scripts.js
├── service-worker.js
├── style.css
├── index.html
├── manifest.json
└── README.md
```

## 🛠️ Tech Stack

- HTML5
- JavaScript (ES6+)
- CSS3 (Bulma and basic native CSS)
- PWA (Service Workers, Manifest)
- GitHub Pages for deployment

## 📲 How to Use

1. Clone this repository
2. Open `index.html` in your browser or serve it via a local server (e.g., Live Server in VS Code). It is also accessible online via [GitHub Pages](https://cstriker421.github.io/frontend1_project_crudit/)
3. Add, edit, or delete tasks – even offline!
4. Switch between list and grid views using the top-right toggle button

## 🔧 Development Setup

```bash
git clone https://github.com/your-username/crudit.git
cd crudit
# Open in your code editor and start live server
```

## ✅ Requirements

1. **CRUD Operations (Create, Read, Update, Delete)**  
   - Implemented in `scripts.js` via `createTodo`, `fetchTodos`, `updateTodo`, `deleteTodo`
2. **Use Mock API**  
   - See API URL and calls in `scripts.js`
3. **Use a Native JavaScript API**  
   - DateTime for clock (see `startClock()` in `scripts.js`)
4. **Form with Validation**  
   - Present in `index.html` with JS validation in `scripts.js`
5. **Use an External UI Library**  
   - Bulma CSS via CDN in `index.html`
6. **Responsive for Mobile/Desktop**  
   - Achieved via Bulma + custom media-friendly layout in `style.css`
7. **Lighthouse: All Green Scores (+90)**  
   - See `/lighthouse-reports/`
8. **Hosted on GitHub Pages**  
   - Visit: [Deployed App](https://cstriker421.github.io/frontend1_project_crudit/)

## 🌟 Bonus

1. **Uses localStorage**  
   - Stores the user's preferred view mode (`list` or `grid`) in `scripts.js` via `localStorage` and applies it with `applyViewPreference()`
2. **PWA Configuration**  
   - Implements offline support using a `service-worker.js` file and `manifest.json` for installable app support. Registered in `scripts.js`
3. **Custom Web Component**
   - Implements a custom `<progress-bar>` element defined via the `ProgressBar` class in `scripts.js`
   - Rendered in `index.html` and dynamically updated by the `displayTodos` function in `scripts.js`, reflecting the percentage of completed todos
4. **Canvas**
   - Uses a `<canvas>` element (`<canvas id="emoji-meter">`) defined in `index.html` to visually represent progress
   - The `drawEmojiMeter()` function in `scripts.js` updates the emoji based on the number of completed tasks:
      - 😟, 🙁, 🙂, 😁, 🤩 — and 🙃 when there are no tasks
   - This logic is triggered inside `displayTodos()`

## 📋 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for educational purposes.