from datetime import date
from .models import RequestLog
from .models import ActiveUserLog


class RequestLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        #log the request
        today = date.today()
        log, created = RequestLog.objects.get_or_create(date=today)
        log.count += 1
        log.save()
        return self.get_response(request)


#getting active users IP
class ActiveUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        self.process_active_user(request)
        response = self.get_response(request)
        return response
    def process_active_user(self, request):
        #skipping admin page
        if request.path.startswith('/admin/'):
            return
        #getting ip
        #followed this: https://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django
        #it was very helpful!
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        today = date.today()
        #checking if already logged
        if not ActiveUserLog.objects.filter(date=today, ip_address=ip).exists():
            ActiveUserLog.objects.create(ip_address=ip, user=request.user if request.user.is_authenticated else None)
            