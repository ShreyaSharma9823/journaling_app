# 📔 JournalBuddy

> *Your private space to think, feel, and reflect — beautifully.*

JournalBuddy is a personal journaling web app where your thoughts stay yours. Built with Django and Django REST Framework, it combines a modern glassmorphism UI with a rich text editor — so writing feels as good as the journals look.

---

## ✨ Features

- **Private & Secure** — Every journal is protected behind authentication. Only you can read your entries.
- **Rich Text Editor** — Powered by Quill.js, write with formatting, lists, and more — not just plain text.
- **Image Uploads** — Attach images to your journal entries and make memories more vivid.
- **Modern UI** — Clean glassmorphism design that makes journaling feel like a pleasure, not a chore.
- **Full CRUD** — Create, read, update, and delete journal entries with ease.
- **Search** — Find any entry instantly by title.
- **REST API** — Clean API backend built with Django REST Framework.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5, Django REST Framework |
| Frontend | HTML5, CSS3, JavaScript |
| Text Editor | Quill.js |
| Database | PostgreSQL |
| Auth | JWT (Session-based) |
| Static Files | WhiteNoise |
| Deployment | Railway |

---

## 🚀 Live Demo

🔗 Coming Soon

---

## 🖥️ Local Setup

### Prerequisites
- Python 3.10+
- PostgreSQL
- pip

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/ShreyaSharma9823/journaling_app.git
cd journaling_app

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file in project root
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=your-postgresql-url

# 5. Run migrations
python manage.py migrate

# 6. Start the server
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser.

---

## 📁 Project Structure

```
journalbuddy/
├── dreamproject/        # Project settings and URLs
├── journals/            # Journal app — models, views, serializers
├── templates/           # HTML templates
├── static/              # CSS, JS, images
├── media/               # User uploaded images
├── requirements.txt
└── manage.py
```

---

## 🔐 Security

- JWT-based authentication — unauthenticated users cannot access any journal data
- Every journal is filtered by logged-in user — no one can access another user's entries
- Secret keys managed via environment variables
- HTTPS enforced on deployment

---

## 🌱 Upcoming Features

- [ ] Email verification on signup
- [ ] Forgot password functionality
- [ ] Dark mode toggle
- [ ] Mood / emotion tracking
- [ ] Export journal as PDF

---

## 👩‍💻 Developer

**Shreya Sharma**  
BCA Student | Django & DRF Developer  
📎 [GitHub](https://github.com/ShreyaSharma9823)  
💼 [LinkedIn](https://linkedin.com/in/your-linkedin-here)

---

> *"Fill your paper with the breathings of your heart." — William Wordsworth*
