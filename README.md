
### Website Name: 📝 CRUDit – A Simple Todo App

## Website Description: Website de To-do List
CRUDit is a lightweight, responsive to-do list app that allows users to **Create**, **Read**, **Update**, and **Delete** tasks with ease. It supports offline functionality via a Progressive Web App (PWA) service worker and offers a clean, mobile-friendly UI powered by Bulma CSS.

## 🚀 Features

- Create, edit, and delete todo items
- Toggle completion status with an emoji indicator
- Inline editing and dynamic view switching (List/Grid)
- Live clock display with current date and time
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
│   ├── desktop.pdf
│   └── mobile.pdf
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
7. **Lighthouse: All Green Scores**  
   - See `/lighthouse-reports/`
8. **Hosted on GitHub Pages**  
   - Visit: [Deployed App](https://cstriker421.github.io/frontend1_project_crudit/)

## 🌟 Bonus

1. **Uses localStorage**  
   - Stores view mode preference (`list` or `grid`) in `scripts.js`
2. **PWA Configuration**  
   - Service worker (`service-worker.js`) and manifest (`manifest.json`) with installable support

## 📋 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for educational purposes.