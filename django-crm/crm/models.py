from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid

# Custom validators
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

# Abstract base class for common fields
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_updated')

    class Meta:
        abstract = True

# Main Client Model - matches your form structure
class Client(TimeStampedModel):
    CLIENT_TYPES = [
        ('corporate', 'Corporate'),
        ('individual', 'Individual'),
        ('government', 'Government'),
        ('non_profit', 'Non-Profit'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('prospect', 'Prospect'),
        ('suspended', 'Suspended'),
    ]

    # Basic Information - matches your form fields
    client_name = models.CharField(max_length=200, verbose_name="Company/Client Name")
    client_reg = models.CharField(max_length=50, verbose_name="Registration Number")
    client_address = models.TextField(verbose_name="Registered Address")
    
    # Contact Information
    contact_person = models.CharField(max_length=200, verbose_name="Contact Person")
    contact_position = models.CharField(max_length=100, verbose_name="Position")
    contact_phone = models.CharField(validators=[phone_regex], max_length=17, verbose_name="Phone Number", blank=True)
    contact_email = models.EmailField(verbose_name="Email Address")
    
    # SETA and Service Details
    SETA_CHOICES = [
        ('wrseta', 'WRSETA'),
        ('chieta', 'CHIETA'),
        ('bankseta', 'BANKSETA'),
        ('fasset', 'FASSET'),
        ('cftl', 'CFTL'),
        ('ceta', 'CETA'),
        ('ctfl', 'CTFL'),
        ('eseta', 'ESETA'),
        ('hwseta', 'HWSETA'),
        ('isett', 'ISETT'),
        ('inseta', 'INSETA'),
        ('lgseta', 'LGSETA'),
        ('merseta', 'MERSETA'),
        ('sassetta', 'SASSETA'),
        ('agriseta', 'AGRISETA'),
        ('dseta', 'DSETA'),
        ('theta', 'THETA'),
        ('teta', 'TETA'),
    ]
    
    seta = models.CharField(max_length=20, choices=SETA_CHOICES, verbose_name="SETA")
    
    SERVICE_CHOICES = [
        ('wsp', 'WSP'),
        ('hr', 'HR'),
        ('both', 'Both WSP & HR'),
    ]
    service = models.CharField(max_length=10, choices=SERVICE_CHOICES, verbose_name="Service Type")
    sdl_number = models.CharField(max_length=50, verbose_name="SDL Number")
    moderator = models.CharField(max_length=200, verbose_name="Skills Program Manager")
    
    # Financial Details
    retainer = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Monthly Retainer (R)")
    payment_terms = models.CharField(max_length=10, choices=[
        ('7', '7 Days'),
        ('15', '15 Days'),
        ('30', '30 Days'),
    ], default='30', verbose_name="Payment Terms")
    
    # Qualification Details
    QUALIFICATION_TYPE_CHOICES = [
        ('graduate', 'Graduate'),
        ('diploma', 'Diploma'),
        ('degree', 'Degree'),
        ('ncv', 'NCV'),
        ('tvet', 'TVET'),
        ('unemployed_learnership', 'Unemployed (Learnership)'),
        ('employed_learnership', 'Employed (Learnership)'),
    ]
    qualification_type = models.CharField(max_length=30, choices=QUALIFICATION_TYPE_CHOICES, verbose_name="Qualification Type")
    qualification_level = models.CharField(max_length=20, verbose_name="Qualification Level")
    cost_per_learner = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cost per Learner (R)")
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='prospect')
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPES, default='corporate')
    
    # Additional fields for future use
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['client_name']
        indexes = [
            models.Index(fields=['client_name']),
            models.Index(fields=['status']),
            models.Index(fields=['seta']),
        ]

    def __str__(self):
        return self.client_name

# Additional Services Model - for the services array in your form
class ClientService(TimeStampedModel):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='services')
    
    SERVICE_TYPE_CHOICES = [
        ('trench1', 'Trench 1'),
        ('trench2', 'Trench 2'),
        ('trench3', 'Trench 3'),
        ('trench4', 'Trench 4'),
    ]
    
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, verbose_name="SLA Type")
    rate = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Rate (R)")
    recurring = models.BooleanField(default=False, verbose_name="Recurring")

    class Meta:
        ordering = ['service_type']

    def __str__(self):
        return f"{self.get_service_type_display()} - {self.client.client_name}"

# Lead Management Models
class Lead(TimeStampedModel):
    LEAD_SOURCES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_call', 'Cold Call'),
        ('social_media', 'Social Media'),
        ('email', 'Email Campaign'),
        ('event', 'Event/Conference'),
        ('other', 'Other'),
    ]
    
    LEAD_STATUS = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted to Quotation'),
        ('lost', 'Lost'),
        ('closed', 'Closed'),
    ]

    # Basic Lead Information
    company_name = models.CharField(max_length=200, verbose_name="Company Name")
    contact_person = models.CharField(max_length=200, verbose_name="Contact Person")
    contact_position = models.CharField(max_length=100, verbose_name="Position")
    contact_phone = models.CharField(validators=[phone_regex], max_length=17, verbose_name="Phone Number")
    contact_email = models.EmailField(verbose_name="Email Address")
    
    # Lead Details
    source = models.CharField(max_length=20, choices=LEAD_SOURCES, verbose_name="Lead Source")
    status = models.CharField(max_length=20, choices=LEAD_STATUS, default='new', verbose_name="Status")
    
    # SETA and Service Information
    seta = models.CharField(max_length=20, choices=Client.SETA_CHOICES, verbose_name="SETA", blank=True)
    service_interest = models.CharField(max_length=10, choices=Client.SERVICE_CHOICES, verbose_name="Service Interest", blank=True)
    
    # Financial Information
    estimated_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Estimated Value (R)", null=True, blank=True)
    
    # Additional Information
    notes = models.TextField(blank=True, verbose_name="Notes")
    next_follow_up = models.DateTimeField(null=True, blank=True, verbose_name="Next Follow-up")
    
    # Conversion tracking
    converted_at = models.DateTimeField(null=True, blank=True, verbose_name="Converted At")
    converted_to_quotation = models.ForeignKey('Quotation', on_delete=models.SET_NULL, null=True, blank=True, related_name='original_lead')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['source']),
            models.Index(fields=['seta']),
            models.Index(fields=['next_follow_up']),
        ]

    def __str__(self):
        return f"{self.company_name} - {self.contact_person}"

    def convert_to_quotation(self):
        """Convert lead to quotation"""
        if self.status != 'converted':
            self.status = 'converted'
            self.converted_at = timezone.now()
            self.save()

class Quotation(TimeStampedModel):
    QUOTATION_STATUS = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
        ('converted', 'Converted to Contract'),
    ]

    # Quotation Details
    quotation_number = models.CharField(max_length=50, unique=True, verbose_name="Quotation Number")
    title = models.CharField(max_length=200, verbose_name="Quotation Title")
    status = models.CharField(max_length=20, choices=QUOTATION_STATUS, default='draft', verbose_name="Status")
    
    # Client Information (can be from lead or existing client)
    client_name = models.CharField(max_length=200, verbose_name="Client Name")
    contact_person = models.CharField(max_length=200, verbose_name="Contact Person")
    contact_position = models.CharField(max_length=100, verbose_name="Position")
    contact_phone = models.CharField(validators=[phone_regex], max_length=17, verbose_name="Phone Number")
    contact_email = models.EmailField(verbose_name="Email Address")
    
    # SETA and Service Details
    seta = models.CharField(max_length=20, choices=Client.SETA_CHOICES, verbose_name="SETA")
    service_type = models.CharField(max_length=10, choices=Client.SERVICE_CHOICES, verbose_name="Service Type")
    sdl_number = models.CharField(max_length=50, verbose_name="SDL Number", blank=True)
    
    # Financial Details
    total_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Total Value (R)")
    payment_terms = models.CharField(max_length=10, choices=[
        ('7', '7 Days'),
        ('15', '15 Days'),
        ('30', '30 Days'),
    ], default='30', verbose_name="Payment Terms")
    
    # Dates
    valid_until = models.DateField(verbose_name="Valid Until")
    sent_date = models.DateTimeField(null=True, blank=True, verbose_name="Sent Date")
    
    # Additional Information
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    # Relationships
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotations')
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotations')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['quotation_number']),
            models.Index(fields=['seta']),
            models.Index(fields=['valid_until']),
        ]

    def __str__(self):
        return f"{self.quotation_number} - {self.client_name}"

    def save(self, *args, **kwargs):
        if not self.quotation_number:
            # Generate quotation number: QT-YYYYMMDD-XXX
            today = timezone.now().strftime('%Y%m%d')
            last_quotation = Quotation.objects.filter(
                quotation_number__startswith=f'QT-{today}'
            ).order_by('-quotation_number').first()
            
            if last_quotation:
                last_number = int(last_quotation.quotation_number.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.quotation_number = f'QT-{today}-{new_number:03d}'
        
        super().save(*args, **kwargs)

class QuotationService(TimeStampedModel):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='services')
    
    SERVICE_TYPE_CHOICES = [
        ('trench1', 'Trench 1'),
        ('trench2', 'Trench 2'),
        ('trench3', 'Trench 3'),
        ('trench4', 'Trench 4'),
        ('wsp', 'WSP Service'),
        ('hr', 'HR Service'),
        ('custom', 'Custom Service'),
    ]
    
    service_name = models.CharField(max_length=200, verbose_name="Service Name")
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, verbose_name="Service Type")
    description = models.TextField(blank=True, verbose_name="Description")
    quantity = models.IntegerField(default=1, verbose_name="Quantity")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Unit Price (R)")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total Price (R)")

    class Meta:
        ordering = ['service_name']

    def __str__(self):
        return f"{self.service_name} - {self.quotation.quotation_number}"

    def save(self, *args, **kwargs):
        # Auto-calculate total price
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
