import logging
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Workout, Exercise, UserProfile, WeekPlan

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source="userprofile.nickname", required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "nickname"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        logger.debug(f"Creating user: {validated_data['username']}")
        logger.debug(f"Raw password: {validated_data['password'][:3]}... (truncated)")

        userprofile_data = validated_data.pop("userprofile", {})
        nickname = userprofile_data.get("nickname", "")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        UserProfile.objects.create(user=user, nickname=nickname)

        logger.debug(f"User created: {user.username}, ID: {user.id}")
        logger.debug(f"Stored hashed password: {user.password[:20]}... (truncated)")

        return user

    def update(self, instance, validated_data):
        if "userprofile" in validated_data:
            userprofile_data = validated_data.pop("userprofile")
            userprofile = instance.userprofile
            userprofile.nickname = userprofile_data.get(
                "nickname", userprofile.nickname
            )
            userprofile.save()

        return super().update(instance, validated_data)


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ["id", "user", "name", "created_at"]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "workout", "name", "sets", "reps", "weight"]


class WeekPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekPlan
        fields = ["id", "user", "name", "data", "created_at", "is_active"]
        read_only_fields = ["user", "created_at"]
