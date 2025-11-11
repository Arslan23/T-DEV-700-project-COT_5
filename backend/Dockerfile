FROM python:3.10.2-slim AS base

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Installation Poetry
ENV POETRY_VERSION=2.1.3
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Création de répertoire de travail temporaire pour les dépendances
WORKDIR /deps

RUN poetry config virtualenvs.create false

FROM base AS dependencies

# Copie seulement des fichiers de dépendances
COPY pyproject.toml poetry.lock* /deps/

# Installation les dépendances dans le système Python global
# Cela installe dans /usr/local/lib/python3.10/site-packages
RUN poetry install --no-interaction --no-ansi --no-root

# Stage développement
FROM dependencies AS development

# Définition du workdir pour l'application
WORKDIR /app

# Les dépendances sont déjà installées globalement
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Stage production
FROM dependencies AS production

WORKDIR /app

# Installer curl pour le health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# En production, on copie tout le code
COPY . /app

EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
