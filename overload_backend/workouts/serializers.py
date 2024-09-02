import logging
from rest_framework import serializers
from django.contrib.auth.models import User

# from django.contrib.auth.hashers import make_password
from .models import Workout, Exercise

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        logger.debug(f"Creating user: {validated_data['username']}")
        logger.debug(f"Raw password: {validated_data['password'][:3]}... (truncated)")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        logger.debug(f"User created: {user.username}, ID: {user.id}")
        logger.debug(f"Stored hashed password: {user.password[:20]}... (truncated)")

        return user

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.set_password(validated_data["password"])
            validated_data.pop("password")
        return super().update(instance, validated_data)


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ["id", "user", "name", "created_at"]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "workout", "name", "sets", "reps", "weight"]
