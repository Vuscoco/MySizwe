from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Client, ClientService, Lead, Quotation, QuotationService
from .serializers import (
    ClientSerializer, ClientCreateSerializer, ClientServiceSerializer,
    LeadSerializer, LeadCreateSerializer, LeadConvertSerializer,
    QuotationSerializer, QuotationCreateSerializer, QuotationServiceSerializer
)

# Create your views here.

def dashboard(request):
    return HttpResponse("<h1>Welcome to My CRM!</h1><p>This is my first Django page.</p>")

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    
    def create(self, request, *args, **kwargs):
        print("Received request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            print("Data is valid, creating client...")
            client = serializer.save()
            return Response({
                'message': 'Client created successfully!',
                'client_id': client.id
            }, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def services(self, request, pk=None):
        client = self.get_object()
        services = client.services.all()
        serializer = ClientServiceSerializer(services, many=True)
        return Response(serializer.data)

# Lead Management Views
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LeadCreateSerializer
        return LeadSerializer
    
    @action(detail=True, methods=['post'])
    def convert_to_quotation(self, request, pk=None):
        """Convert lead to quotation"""
        lead = self.get_object()
        serializer = LeadConvertSerializer(data=request.data, context={'lead': lead})
        
        if serializer.is_valid():
            result = serializer.save()
            return Response({
                'message': 'Lead converted to quotation successfully!',
                'lead_id': result['lead'].id,
                'quotation_id': result['quotation'].id,
                'quotation_number': result['quotation'].quotation_number
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get lead statistics for dashboard"""
        total_leads = Lead.objects.count()
        new_leads = Lead.objects.filter(status='new').count()
        qualified_leads = Lead.objects.filter(status='qualified').count()
        converted_leads = Lead.objects.filter(status='converted').count()
        
        # Monthly lead generation (last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_leads = Lead.objects.filter(
            created_at__gte=six_months_ago
        ).extra(
            select={'month': "EXTRACT(month FROM created_at)"}
        ).values('month').annotate(count=Count('id')).order_by('month')
        
        # Lead sources distribution
        sources_distribution = Lead.objects.values('source').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'total_leads': total_leads,
            'new_leads': new_leads,
            'qualified_leads': qualified_leads,
            'converted_leads': converted_leads,
            'monthly_leads': list(monthly_leads),
            'sources_distribution': list(sources_distribution)
        })

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return QuotationCreateSerializer
        return QuotationSerializer
    
    @action(detail=True, methods=['post'])
    def send_quotation(self, request, pk=None):
        """Mark quotation as sent"""
        quotation = self.get_object()
        quotation.status = 'sent'
        quotation.sent_date = timezone.now()
        quotation.save()
        
        return Response({
            'message': 'Quotation marked as sent successfully!',
            'sent_date': quotation.sent_date
        })
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update quotation status"""
        quotation = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Quotation.QUOTATION_STATUS):
            quotation.status = new_status
            quotation.save()
            return Response({
                'message': f'Quotation status updated to {new_status}',
                'status': quotation.status
            })
        else:
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get quotation statistics for dashboard"""
        total_quotations = Quotation.objects.count()
        draft_quotations = Quotation.objects.filter(status='draft').count()
        sent_quotations = Quotation.objects.filter(status='sent').count()
        accepted_quotations = Quotation.objects.filter(status='accepted').count()
        
        # Total value of quotations
        total_value = Quotation.objects.aggregate(
            total=Sum('total_value')
        )['total'] or 0
        
        # Monthly quotation value (last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_value = Quotation.objects.filter(
            created_at__gte=six_months_ago
        ).extra(
            select={'month': "EXTRACT(month FROM created_at)"}
        ).values('month').annotate(
            total=Sum('total_value')
        ).order_by('month')
        
        return Response({
            'total_quotations': total_quotations,
            'draft_quotations': draft_quotations,
            'sent_quotations': sent_quotations,
            'accepted_quotations': accepted_quotations,
            'total_value': total_value,
            'monthly_value': list(monthly_value)
        })

class DashboardViewSet(viewsets.ViewSet):
    """Dashboard statistics and metrics"""
    
    @action(detail=False, methods=['get'])
    def metrics(self, request):
        """Get all dashboard metrics"""
        # Lead metrics
        total_leads = Lead.objects.count()
        active_leads = Quotation.objects.filter(status__in=['draft', 'sent']).count()
        
        # Conversion rate calculation
        converted_leads = Lead.objects.filter(status='converted').count()
        conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0
        
        # Total value
        total_value = Quotation.objects.aggregate(
            total=Sum('total_value')
        )['total'] or 0
        
        # Format total value as R 2.5M format
        if total_value >= 1000000:
            formatted_value = f"R {total_value / 1000000:.1f}M"
        else:
            formatted_value = f"R {total_value:,.0f}"
        
        return Response({
            'leads': total_leads,
            'active_leads': active_leads,
            'conversion_rate': round(conversion_rate, 1),
            'total_value': formatted_value,
            'raw_total_value': total_value
        })
    
    @action(detail=False, methods=['get'])
    def recent_activities(self, request):
        """Get recent leads and quotations"""
        recent_leads = Lead.objects.order_by('-created_at')[:5]
        recent_quotations = Quotation.objects.order_by('-created_at')[:5]
        
        lead_serializer = LeadSerializer(recent_leads, many=True)
        quotation_serializer = QuotationSerializer(recent_quotations, many=True)
        
        return Response({
            'recent_leads': lead_serializer.data,
            'recent_quotations': quotation_serializer.data
        })
