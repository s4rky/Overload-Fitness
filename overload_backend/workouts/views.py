import logging
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Workout, Exercise, WeekPlan
from .serializers import (
    UserSerializer,
    WorkoutSerializer,
    ExerciseSerializer,
    WeekPlanSerializer,
)
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from .models import UserProfile
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

logger = logging.getLogger(__name__)


class GetCSRFToken(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format=None):
        return Response({"csrfToken": get_token(request)})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    @method_decorator(ensure_csrf_cookie)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        logger.debug(f"Login attempt for user: {username}")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            logger.debug(f"User {username} authenticated successfully")

            # Get or create UserProfile
            user_profile, created = UserProfile.objects.get_or_create(user=user)

            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "nickname": user_profile.nickname or user.username,
                    "message": "Login successful",
                    "csrfToken": get_token(request),
                }
            )
        else:
            logger.warning(f"Authentication failed for user: {username}")
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["post"])
    @method_decorator(ensure_csrf_cookie)
    def logout(self, request):
        logout(request)
        return Response({"message": "Logout successful"})


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Exercise.objects.filter(workout__user=self.request.user)


class WeekPlanViewSet(viewsets.ModelViewSet):
    queryset = WeekPlan.objects.all()
    serializer_class = WeekPlanSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, BasicAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return WeekPlan.objects.filter(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def latest(self, request):
        latest_plan = self.get_queryset().order_by("-created_at").first()
        if latest_plan:
            serializer = self.get_serializer(latest_plan)
            return Response(serializer.data)
        else:
            return Response(
                {"detail": "No week plan found"}, status=status.HTTP_404_NOT_FOUND
            )
