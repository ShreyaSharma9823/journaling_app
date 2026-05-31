from django.utils import timezone
from rest_framework import serializers
from .models import Journal_uploaded

class journal_uploaded_serializer(serializers.ModelSerializer):
    journal_date = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = Journal_uploaded
        fields = ['id', 'journal_title', 'journal_description', 'journal_date']

    def validate_journal_date(self, value):
        return value or timezone.now()

    def create(self, validated_data):
        validated_data['journal_date'] = validated_data.get('journal_date') or timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'journal_date' in validated_data and not validated_data['journal_date']:
            validated_data['journal_date'] = timezone.now()
        return super().update(instance, validated_data)
