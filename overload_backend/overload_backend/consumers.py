# app/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ..workouts.models import WeekPlan
from ..workouts.serializers import WeekPlanSerializer


class WeekPlanConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            f"user_{self.scope['user'].id}", self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f"user_{self.scope['user'].id}", self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        if message == "get_latest_plan":
            latest_plan = await self.get_latest_plan()
            await self.send(
                text_data=json.dumps({"type": "week_plan", "plan": latest_plan})
            )

    async def week_plan_update(self, event):
        await self.send(
            text_data=json.dumps({"type": "week_plan", "plan": event["plan"]})
        )

    @database_sync_to_async
    def get_latest_plan(self):
        latest_plan = (
            WeekPlan.objects.filter(user=self.scope["user"])
            .order_by("-created_at")
            .first()
        )
        if latest_plan:
            return WeekPlanSerializer(latest_plan).data
        return None
