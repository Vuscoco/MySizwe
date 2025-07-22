#!/usr/bin/env python
"""
Test script for the Lead Management System
Run this script to test the API endpoints
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000/api"

def test_dashboard_metrics():
    """Test the dashboard metrics endpoint"""
    print("Testing Dashboard Metrics...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/metrics/")
        if response.status_code == 200:
            data = response.json()
            print("✅ Dashboard metrics retrieved successfully!")
            print(f"   Leads: {data.get('leads', 0)}")
            print(f"   Active Leads: {data.get('active_leads', 0)}")
            print(f"   Conversion Rate: {data.get('conversion_rate', 0)}%")
            print(f"   Total Value: {data.get('total_value', 'R 0')}")
        else:
            print(f"❌ Failed to get dashboard metrics: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing dashboard metrics: {e}")

def test_create_lead():
    """Test creating a new lead"""
    print("\nTesting Lead Creation...")
    lead_data = {
        "company_name": "Test Company Ltd",
        "contact_person": "John Doe",
        "contact_position": "HR Manager",
        "contact_phone": "+27123456789",
        "contact_email": "john.doe@testcompany.com",
        "source": "website",
        "seta": "wrseta",
        "service_interest": "wsp",
        "estimated_value": "50000.00",
        "notes": "Test lead for demonstration purposes"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/leads/", json=lead_data)
        if response.status_code == 201:
            data = response.json()
            print("✅ Lead created successfully!")
            print(f"   Lead ID: {data.get('id')}")
            print(f"   Company: {data.get('company_name')}")
            return data.get('id')
        else:
            print(f"❌ Failed to create lead: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating lead: {e}")
        return None

def test_create_quotation(lead_id=None):
    """Test creating a quotation"""
    print("\nTesting Quotation Creation...")
    quotation_data = {
        "title": "WSP Services Quotation",
        "client_name": "Test Company Ltd",
        "contact_person": "John Doe",
        "contact_position": "HR Manager",
        "contact_phone": "+27123456789",
        "contact_email": "john.doe@testcompany.com",
        "seta": "wrseta",
        "service_type": "wsp",
        "sdl_number": "SDL123456",
        "total_value": "50000.00",
        "payment_terms": "30",
        "valid_until": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "notes": "Test quotation for demonstration",
        "lead": lead_id
    }
    
    try:
        response = requests.post(f"{BASE_URL}/quotations/", json=quotation_data)
        if response.status_code == 201:
            data = response.json()
            print("✅ Quotation created successfully!")
            print(f"   Quotation Number: {data.get('quotation_number')}")
            print(f"   Total Value: R {data.get('total_value')}")
            return data.get('id')
        else:
            print(f"❌ Failed to create quotation: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating quotation: {e}")
        return None

def test_recent_activities():
    """Test the recent activities endpoint"""
    print("\nTesting Recent Activities...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/recent_activities/")
        if response.status_code == 200:
            data = response.json()
            print("✅ Recent activities retrieved successfully!")
            print(f"   Recent Leads: {len(data.get('recent_leads', []))}")
            print(f"   Recent Quotations: {len(data.get('recent_quotations', []))}")
        else:
            print(f"❌ Failed to get recent activities: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing recent activities: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing Lead Management System")
    print("=" * 50)
    
    # Test dashboard metrics
    test_dashboard_metrics()
    
    # Test creating a lead
    lead_id = test_create_lead()
    
    # Test creating a quotation
    quotation_id = test_create_quotation(lead_id)
    
    # Test recent activities
    test_recent_activities()
    
    # Test dashboard metrics again to see the changes
    print("\n" + "=" * 50)
    print("Testing Dashboard Metrics After Creating Data...")
    test_dashboard_metrics()
    
    print("\n🎉 Testing completed!")

if __name__ == "__main__":
    main() 