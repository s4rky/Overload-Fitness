from django.db import models
from django.contrib.auth.models import User


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(max_length=3)  # 'sun', 'mon', etc.
    name = models.CharField(max_length=100)
    is_rest = models.BooleanField(default=False)
    exercises = models.JSONField(default=list)

    class Meta:
        unique_together = ("user", "day")

    def __str__(self):
        return f"{self.user.username}'s {self.day} plan: {self.name}"


class Exercise(models.Model):
    workout = models.ForeignKey(
        Workout, related_name="exercises", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    sets = models.IntegerField()
    reps = models.IntegerField()
    weight = models.FloatField()

    def __str__(self):
        return f"{self.name} - {self.sets}x{self.reps} at {self.weight}kg"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.user.username
