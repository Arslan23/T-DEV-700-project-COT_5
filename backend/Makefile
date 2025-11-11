.PHONY: install install-dev start migrate makemigrations test lint format precommit

install:
	poetry install --no-interaction

install-dev:
	poetry install

start:
	poetry run python manage.py runserver

codestyle:
	poetry run ruff check .
	poetry run ruff format --check .

makemigrations:
	poetry run python manage.py makemigrations

migrate:
	poetry run python manage.py migrate

check_migrations:
	poetry run python manage.py makemigrations --check --dry-run

shell:
	poetry run python manage.py shell

# test:
# 	poetry run pytest -q

test:
	poetry run coverage run -m pytest --ignore=scraper -s --junitxml=test-reports/junit/junit.xml
	poetry run coverage report
	poetry run coverage xml -o test-reports/coverage/coverage.xml
	poetry run coverage html -d test-reports/coverage/html

test_unit:
	@poetry run pytest -s --reuse-db -v -k $(word 2, $(MAKECMDGOALS))

coverage:
	poetry run coverage run -m pytest && poetry run coverage report -m

lint:
	poetry run ruff check .

format:
	poetry run black .

precommit-install:
	poetry run pre-commit install

fixtures:
	poetry run python manage.py loaddata users/fixtures/groups.json

# For Dockerized runs
docker-build:
	docker build -t attendance-backend .

docker-run:
	docker run --rm -p 8000:8000 attendance-backend
