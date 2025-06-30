# MORACRM
task for Ala Mora

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Apply migrations:
   ```bash
   python manage.py migrate
   ```
3. Create a superuser (optional, for admin access):
   ```bash
   python manage.py createsuperuser
   ```
4. Run the development server:
   ```bash
   python manage.py runserver
   ```

The application will be available at `http://localhost:8000/`.
Visit `/register/` to create a new account or `/login/` to sign in.
