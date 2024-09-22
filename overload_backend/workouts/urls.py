from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    WorkoutViewSet,
    ExerciseViewSet,
    GetCSRFToken,
    WeekPlanViewSet,
)

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"workouts", WorkoutViewSet)
router.register(r"exercises", ExerciseViewSet)
router.register(r"weekplans", WeekPlanViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("get-csrf-token/", GetCSRFToken.as_view(), name="get_csrf_token"),
    path("weekplans/<int:pk>/set_active/", WeekPlanViewSet.as_view({'post': 'set_active'}), name="set_active_plan"),
    path("weekplans/active/", WeekPlanViewSet.as_view({'get': 'active'}), name="get_active_plan"),
]
