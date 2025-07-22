from rest_framework import serializers
from .models import Client, ClientService, Lead, Quotation, QuotationService
from django.utils import timezone

class ClientServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientService
        fields = ['id', 'service_type', 'rate', 'recurring']

class ClientSerializer(serializers.ModelSerializer):
    services = ClientServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Client
        fields = [
            'id', 'client_name', 'client_reg', 'client_address',
            'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'seta', 'service', 'sdl_number', 'moderator',
            'retainer', 'payment_terms',
            'qualification_type', 'qualification_level', 'cost_per_learner',
            'status', 'client_type', 'notes', 'tags',
            'services', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ClientCreateSerializer(serializers.ModelSerializer):
    services = ClientServiceSerializer(many=True, required=False)
    
    class Meta:
        model = Client
        fields = [
            'client_name', 'client_reg', 'client_address',
            'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'seta', 'service', 'sdl_number', 'moderator',
            'retainer', 'payment_terms',
            'qualification_type', 'qualification_level', 'cost_per_learner',
            'services'
        ]

    def validate(self, data):
        # Add custom validation if needed
        print("Validating data:", data)
        return data

    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        print("Creating client with data:", validated_data)
        client = Client.objects.create(**validated_data)
        
        for service_data in services_data:
            print("Creating service:", service_data)
            ClientService.objects.create(client=client, **service_data)
        
        return client

# Lead Management Serializers
class QuotationServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationService
        fields = ['id', 'service_name', 'service_type', 'description', 'quantity', 'unit_price', 'total_price']

class QuotationSerializer(serializers.ModelSerializer):
    services = QuotationServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quotation
        fields = [
            'id', 'quotation_number', 'title', 'status',
            'client_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'seta', 'service_type', 'sdl_number',
            'total_value', 'payment_terms',
            'valid_until', 'sent_date', 'notes',
            'lead', 'client', 'services',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'quotation_number', 'created_at', 'updated_at']

class QuotationCreateSerializer(serializers.ModelSerializer):
    services = QuotationServiceSerializer(many=True, required=False)
    
    class Meta:
        model = Quotation
        fields = [
            'title', 'client_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'seta', 'service_type', 'sdl_number',
            'total_value', 'payment_terms',
            'valid_until', 'notes', 'lead', 'client', 'services'
        ]

    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        quotation = Quotation.objects.create(**validated_data)
        
        for service_data in services_data:
            QuotationService.objects.create(quotation=quotation, **service_data)
        
        return quotation

class LeadSerializer(serializers.ModelSerializer):
    quotations = QuotationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lead
        fields = [
            'id', 'company_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'source', 'status', 'seta', 'service_interest',
            'estimated_value', 'notes', 'next_follow_up',
            'converted_at', 'converted_to_quotation', 'quotations',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'converted_at', 'converted_to_quotation']

class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'company_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email',
            'source', 'seta', 'service_interest',
            'estimated_value', 'notes', 'next_follow_up'
        ]

class LeadConvertSerializer(serializers.Serializer):
    """Serializer for converting lead to quotation"""
    quotation_data = QuotationCreateSerializer()
    
    def create(self, validated_data):
        lead = self.context['lead']
        quotation_data = validated_data['quotation_data']
        
        # Create quotation
        services_data = quotation_data.pop('services', [])
        quotation = Quotation.objects.create(
            lead=lead,
            client_name=lead.company_name,
            contact_person=lead.contact_person,
            contact_position=lead.contact_position,
            contact_phone=lead.contact_phone,
            contact_email=lead.contact_email,
            **quotation_data
        )
        
        # Create quotation services
        for service_data in services_data:
            QuotationService.objects.create(quotation=quotation, **service_data)
        
        # Update lead status
        lead.status = 'converted'
        lead.converted_at = timezone.now()
        lead.converted_to_quotation = quotation
        lead.save()
        
        return {'lead': lead, 'quotation': quotation} 