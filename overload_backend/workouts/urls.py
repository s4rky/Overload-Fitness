from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, WorkoutViewSet, ExerciseViewSet, GetCSRFToken

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"workouts", WorkoutViewSet)
router.register(r"exercises", ExerciseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("get-csrf-token/", GetCSRFToken.as_view(), name="get_csrf_token"),
]
