import logging
from django.contrib.auth import authenticate, login, logout
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
from .models import UserProfile
from .models import WorkoutPlan
from .serializers import WorkoutPlanSerializer

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


class WorkoutPlanViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def save_plan(self, request):
        try:
            plans = request.data
            for day, plan in plans.items():
                WorkoutPlan.objects.update_or_create(
                    user=request.user,
                    day=day,
                    defaults={
                        "name": plan["name"],
                        "is_rest": plan["isRest"],
                        "exercises": plan.get("exercises", []),
                    },
                )
            return Response({"message": "Workout plan saved successfully"})
        except Exception as e:
            logger.error(f"Error saving workout plan: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
