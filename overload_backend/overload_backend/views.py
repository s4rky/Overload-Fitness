import logging
from django.contrib.auth import authenticate
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Workout, Exercise
from .serializers import WorkoutSerializer, ExerciseSerializer, UserSerializer

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        logger.info(f"Login attempt for user: {username}")
        
        user = authenticate(request, username=username, password=password)
        if user:
            logger.info(f"Login successful for user: {username}")
            return Response({'id': user.id, 'username': user.username})
        else:
            logger.warning(f"Login failed for user: {username}")
            logger.debug(f"Request data: {request.data}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        logger.info(f"Attempting to create user: {request.data.get('username')}")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        logger.info(f"User created successfully: {serializer.data.get('username')}")
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
