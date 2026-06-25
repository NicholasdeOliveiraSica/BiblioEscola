# 📚 School Library System

A complete and simple system for managing school libraries. Designed to provide a modern and efficient experience with Vue 3, Tailwind CSS, and Electron.

The project has two versions:
- 🖥️ **Desktop**: Fully offline, based on Electron, with data saved in a local JSON file.
- 🌐 **Web Demo**: Runs in the browser, using Vue + Vite, with persistence via LocalStorage.

## 🚀 About the Project

Easily manage classes, students, and loans with just a few clicks, focusing on simplicity and usability. There is no separate book registration: the book's name is provided at the time of the loan.

## 🧱 Technologies

**Desktop:**  
Vue 3 · Electron · Tailwind CSS · Local persistence via JSON

**Web Demo:**  
Vue 3 · Vite · Tailwind CSS · Persistence using the browser's LocalStorage

## 📦 Features

- **Dashboard:** System overview, total classes, students, and loan statuses (open and returned)
- **Classes:** Create, edit, delete, and view the number of students per class
- **Students:** Complete CRUD, class assignment, and loan history
- **Loans:** Create and return books, status control (loaned/returned), filters, and search

## 💾 Persistence

- **Desktop:** 100% offline data, locally saved in a JSON file
- **Web Demo:** Persistence using the browser's LocalStorage

## 🖥️ How to Run

Install dependencies:
```
npm install
```

Run the web version (demo):
```
npm run dev
```

Run the desktop version (Electron):
```
npm run electron:dev
```

To build the desktop version (Windows):
```
npm run dist
```

## 📁 Project Structure

```
src/
 ├─ components/
 ├─ views/
 ├─ composables/
 ├─ services/
 ├─ router/

electron/
 ├─ main.js
 ├─ preload.js
 ├─ db.js
```

## 📌 Notes

- The desktop version works fully offline, with no need for a backend or external APIs.
- Modern and responsive interface, built with Tailwind CSS.
- Clear structure separating web and desktop code.
- Focused on simplicity and user experience.