import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "overload_backend.settings")
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

def update_passwords():
    users = User.objects.all()
    for user in users:
        # Assume the password is the same as the username for this example
        # In a real scenario, you'd want to set this to a known value or prompt for input
        user.password = make_password(user.username)
        user.save()
        print(f"Updated password for user: {user.username}")

if __name__ == "__main__":
    update_passwords()
