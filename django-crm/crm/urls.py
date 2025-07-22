from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'clients', views.ClientViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'quotations', views.QuotationViewSet)
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('api/', include(router.urls)),
    path('dashboard/', views.dashboard, name='dashboard'),
] 