# 🧭 Time Manager — Backend (Django REST Framework)

Ce projet constitue le backend du système **Time Manager**, une application de gestion des équipes, rôles et présences.
Il est construit avec **Django + Django REST Framework**, et géré via **Poetry** pour la gestion des dépendances.

---

## 🚀 Prérequis

Avant de lancer le projet, assure-toi d’avoir :

* **Python 3.10.2**
* **Poetry 2.1.3**
* **PostgreSQL** installé et en fonctionnement
* **Redis** (optionnel)

NB : Redis est un outil de cache notamment utilisé sur ce projet pour stocker les files d’attente et les résultats des tâches Celery. Si le projet peut tourner sans, Redis est nécessaire pour exécuter les tâches planifiées et les jobs asynchrones.

---

## 📦 Installation & Lancement en local

### 1. Cloner le projet

```bash
git clone <url-du-dépôt>
cd backend
```

---

### 2. Créer et activer l’environnement virtuel

- Créer un environnement virtuel Python

```bash
python -m venv venv
```

- Activer l'environnement virtuel

```bash
source venv/bin/activate  
```

---

### 3. Installer les dépendances avec Poetry

Cette commande installe automatiquement toutes les dépendances du projet listées dans `pyproject.toml`.

```bash
poetry install
```

---

### 4. Configurer les variables d’environnement

Copie le fichier modèle de configuration et adapte-le :

```bash
cp core/local_settings_template.py core/local_settings.py
```

Ouvre ensuite `local_settings.py` et vérifie ces points :

* Mets `DEBUG = True`
* Vérifie les infos de connexion PostgreSQL :

  ```python
  DATABASES = {
      "default": {
          "ENGINE": "django.db.backends.postgresql",
          "NAME": "...",
          "USER": "...",
          "PASSWORD": "...",
          "HOST": "127.0.0.1",
          "PORT": "5432",
      }
  }
  ```

---

### 5. Configurer la base de données PostgreSQL

Crée une base de données locale et accorder l'accès au user renseigné

---

### 6. Appliquer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 7. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

Suis les instructions pour définir un nom d’utilisateur et un mot de passe admin.

---

### 8. Charger les fixtures du projet (groups, permissions)

Le custom hook créé check le codestyle et les migrations avant les pushs

```bash
make fixtures
```

---

### 9. Setup le hook de pre-commit en local

Le custom hook créé check le codestyle et les migrations avant les pushs

```bash
poetry run pre-commit install
```

---

### 10. Lancer le serveur local

```bash
python manage.py runserver
```

**Le backend sera disponible sur** :
👉 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)


---

## Exécution de Celery

Pour lancer Celery dans le projet, utilise les commandes suivantes :

### 1. Lancer le worker Celery

```bash
poetry run celery -A backend worker --loglevel=info
```

### 2. Lancer le scheduler (Celery Beat) pour les tâches planifiées

```bash
poetry run celery -A backend beat --loglevel=info
```

> Le worker doit être lancé **avant** le beat, sinon les tâches planifiées ne s’exécuteront pas.

### 3. Tester manuellement la tâche `create_daily_attendance_records`

Tester directement depuis Django shell :

```bash
poetry run python manage.py shell
```

Puis dans le shell Python :

```python
from attendance.tasks import create_daily_attendance_records
create_daily_attendance_records.delay()  # Exécute la tâche en arrière-plan
```

---

## 🧩 Structure du projet

```
backend/
├── manage.py
├── .env.example
├── .pre-commit-config.yaml
├── Dockerfile
├── Makefile
├── pytest.ini
├── Readme.md
├── pyproject.toml          # Gestion des dépendances via Poetry
├── local_settings_template.py
├── core/                 # Réglages Django (settings, urls, wsgi)
├── users/                  # App de gestion des utilisateurs & rôles
├── teams/                  # App de gestion des équipes
├── attendance/             # App de gestion des présences
└── ...
```

---

## 🧠 Notes importantes

* Si tu modifies le modèle `User`, assure-toi que ton `settings.py` contient :

  ```python
  AUTH_USER_MODEL = "users.User"
  ```
* Les variables d’environnement peuvent être placées dans un fichier `.env` (géré par `python-dotenv`).

Exemple de `.env` :

```
ENV=dev
DB_NAME=time_manager
DB_USER=time_manager
DB_PASSWORD=time_manager
DB_HOST=127.0.0.1
DB_PORT=5432
```

---

## 🧰 Commandes utiles

| Action                         | Commande                                                      |
| ------------------------------ | ------------------------------------------------------------- |
| Installer les dépendances      | `poetry install`                                              |
| Activer le venv Poetry         | `poetry shell`                                                |
| Lancer le serveur local        | `python manage.py runserver`                                  |
| Faire les migrations           | `python manage.py migrate`                                    |
| Créer un superutilisateur      | `python manage.py createsuperuser`                            |
| Lister les dépendances         | `poetry show`                                                 |
| Exporter vers requirements.txt | `poetry export -f requirements.txt --output requirements.txt` |
