import logging
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Workout, Exercise
from .serializers import UserSerializer, WorkoutSerializer, ExerciseSerializer
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        logger.debug(f"User created via API: {serializer.instance.username}")
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

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
            return Response(
                {
                    "id": user.id,
                    "username": user.username,
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
    def check_password(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        try:
            user = User.objects.get(username=username)
            is_correct = check_password(password, user.password)
            logger.debug(
                f"Password check for {username}: {'Correct' if is_correct else 'Incorrect'}"
            )
            logger.debug(f"Stored hash: {user.password[:20]}...")
            return Response(
                {
                    "username": username,
                    "password_correct": is_correct,
                    "stored_hash": user.password[:20]
                    + "...",  # Only show part of the hash for security
                }
            )
        except User.DoesNotExist:
            logger.warning(f"User {username} not found during password check")
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


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
