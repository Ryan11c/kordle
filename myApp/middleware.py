from datetime import date
from .models import RequestLog

class RequestLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        #Log the request
        today = date.today()
        log, created = RequestLog.objects.get_or_create(date=today)
        log.count += 1
        log.save()
        return self.get_response(request)
