from rest_framework.routers import DefaultRouter
from .views import journal_uploaded_viewset
router = DefaultRouter()    
router.register(r'journals', journal_uploaded_viewset, basename='journals')
urlpatterns = router.urls