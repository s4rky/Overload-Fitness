from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    logger.info(f"Generated CSRF token: {token}")
    return JsonResponse({"csrfToken": token})
