from django.contrib import admin
from django.contrib.auth.models import Group, User
from .models import Profile, ActiveUserLog

# Register your models here.
admin.site.unregister(Group)

class ProfileInline(admin.StackedInline):
    model = Profile

class UserAdmin(admin.ModelAdmin):
    model = User
    fields = ["username"]
    inlines = [ProfileInline]

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(ActiveUserLog)
class ActiveUserLogAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'date', 'user')
    list_filter = ('date',)