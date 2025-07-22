from django.contrib import admin
from .models import Client, ClientService, Lead, Quotation, QuotationService

class ClientServiceInline(admin.TabularInline):
    model = ClientService
    extra = 1

class QuotationServiceInline(admin.TabularInline):
    model = QuotationService
    extra = 1

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'contact_person', 'contact_email', 'seta', 'service', 'status', 'created_at']
    list_filter = ['status', 'seta', 'service', 'client_type', 'created_at']
    search_fields = ['client_name', 'contact_person', 'contact_email', 'client_reg']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ClientServiceInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('client_name', 'client_reg', 'client_address', 'status', 'client_type')
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'contact_position', 'contact_phone', 'contact_email')
        }),
        ('SETA and Service Details', {
            'fields': ('seta', 'service', 'sdl_number', 'moderator')
        }),
        ('Financial Details', {
            'fields': ('retainer', 'payment_terms')
        }),
        ('Qualification Details', {
            'fields': ('qualification_type', 'qualification_level', 'cost_per_learner')
        }),
        ('Additional Information', {
            'fields': ('notes', 'tags'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'contact_email', 'source', 'status', 'seta', 'created_at']
    list_filter = ['status', 'source', 'seta', 'service_interest', 'created_at']
    search_fields = ['company_name', 'contact_person', 'contact_email']
    readonly_fields = ['created_at', 'updated_at', 'converted_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email')
        }),
        ('Lead Details', {
            'fields': ('source', 'status', 'seta', 'service_interest', 'estimated_value')
        }),
        ('Follow-up', {
            'fields': ('next_follow_up', 'notes')
        }),
        ('Conversion', {
            'fields': ('converted_at', 'converted_to_quotation'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_contacted', 'mark_as_qualified', 'mark_as_lost']
    
    def mark_as_contacted(self, request, queryset):
        queryset.update(status='contacted')
    mark_as_contacted.short_description = "Mark selected leads as contacted"
    
    def mark_as_qualified(self, request, queryset):
        queryset.update(status='qualified')
    mark_as_qualified.short_description = "Mark selected leads as qualified"
    
    def mark_as_lost(self, request, queryset):
        queryset.update(status='lost')
    mark_as_lost.short_description = "Mark selected leads as lost"

@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ['quotation_number', 'client_name', 'contact_person', 'status', 'total_value', 'seta', 'created_at']
    list_filter = ['status', 'seta', 'service_type', 'created_at']
    search_fields = ['quotation_number', 'client_name', 'contact_person', 'title']
    readonly_fields = ['quotation_number', 'created_at', 'updated_at']
    inlines = [QuotationServiceInline]
    
    fieldsets = (
        ('Quotation Details', {
            'fields': ('quotation_number', 'title', 'status', 'valid_until', 'sent_date')
        }),
        ('Client Information', {
            'fields': ('client_name', 'contact_person', 'contact_position', 'contact_phone', 'contact_email')
        }),
        ('Service Details', {
            'fields': ('seta', 'service_type', 'sdl_number')
        }),
        ('Financial Details', {
            'fields': ('total_value', 'payment_terms')
        }),
        ('Relationships', {
            'fields': ('lead', 'client'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_sent', 'mark_as_accepted', 'mark_as_rejected']
    
    def mark_as_sent(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='sent', sent_date=timezone.now())
    mark_as_sent.short_description = "Mark selected quotations as sent"
    
    def mark_as_accepted(self, request, queryset):
        queryset.update(status='accepted')
    mark_as_accepted.short_description = "Mark selected quotations as accepted"
    
    def mark_as_rejected(self, request, queryset):
        queryset.update(status='rejected')
    mark_as_rejected.short_description = "Mark selected quotations as rejected"

@admin.register(QuotationService)
class QuotationServiceAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'quotation', 'service_type', 'quantity', 'unit_price', 'total_price']
    list_filter = ['service_type', 'quotation__status']
    search_fields = ['service_name', 'quotation__quotation_number']
    readonly_fields = ['total_price']
