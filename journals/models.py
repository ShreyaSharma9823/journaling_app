from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Journal_uploaded(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals', null=True, blank=True)
    journal_title = models.CharField(max_length=255)
    journal_description = models.TextField()
    journal_date = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'journal_title'], name='unique_journal_title_per_user')
        ]

