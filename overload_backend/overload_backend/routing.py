from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/weekplan/$", consumers.WeekPlanConsumer.as_asgi()),
]
