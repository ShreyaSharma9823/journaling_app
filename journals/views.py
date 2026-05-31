from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Journal_uploaded
from .serializers import journal_uploaded_serializer

class journal_uploaded_viewset(viewsets.ModelViewSet):
    serializer_class = journal_uploaded_serializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Journal_uploaded.objects.filter(owner=self.request.user).order_by('-journal_date', '-id')
        params = getattr(self.request, 'query_params', self.request.GET)
        search_query = params.get('search', '').strip()

        if search_query:
            queryset = queryset.filter(
                Q(journal_title__icontains=search_query) |
                Q(journal_date__icontains=search_query)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
