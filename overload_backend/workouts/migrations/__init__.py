from django.db import migrations


def create_user_profiles(apps, schema_editor):
    User = apps.get_model("auth", "User")
    UserProfile = apps.get_model("workouts", "UserProfile")
    for user in User.objects.all():
        UserProfile.objects.get_or_create(user=user, nickname=user.username)


class Migration(migrations.Migration):

    dependencies = [
        (
            "workouts",
            "XXXX_previous_migration",
        ),  # Replace with the actual previous migration
    ]

    operations = [
        migrations.RunPython(create_user_profiles),
    ]
