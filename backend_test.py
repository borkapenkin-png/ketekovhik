#!/usr/bin/env python3
"""
KETE Kohvik Backend API Testing
Tests all admin CMS panel functionality and public API endpoints
"""

import requests
import sys
import json
import os
from datetime import datetime

class KETEKohvikAPITester:
    def __init__(self, base_url="https://premium-web-design-12.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {
            "username": os.environ.get("ADMIN_TEST_USERNAME", "admin"),
            "password": os.environ.get("ADMIN_TEST_PASSWORD", "")
        }

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        if details and success:
            print(f"   ℹ️  {details}")

    def test_endpoint(self, method, endpoint, expected_status, data=None, auth_required=False):
        """Generic endpoint tester"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            
            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success and response.status_code != 204:
                try:
                    json_data = response.json()
                    if isinstance(json_data, list):
                        details += f", Items: {len(json_data)}"
                    elif isinstance(json_data, dict) and 'message' in json_data:
                        details += f", Message: {json_data['message']}"
                except:
                    pass
            
            return success, response, details
            
        except Exception as e:
            return False, None, f"Error: {str(e)}"

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n🔐 Testing Admin Authentication...")
        
        success, response, details = self.test_endpoint(
            'POST', 'auth/login', 200, self.admin_credentials
        )
        
        if success:
            try:
                user_data = response.json()
                if user_data.get('username') == 'admin' and user_data.get('role') == 'admin':
                    details += f", User: {user_data['username']}, Role: {user_data['role']}"
                    self.log_test("Admin login", True, details)
                    return True
                else:
                    self.log_test("Admin login", False, "Invalid user data returned")
                    return False
            except:
                self.log_test("Admin login", False, "Invalid JSON response")
                return False
        else:
            self.log_test("Admin login", False, details)
            return False

    def test_auth_me(self):
        """Test auth/me endpoint"""
        success, response, details = self.test_endpoint('GET', 'auth/me', 200)
        
        if success:
            try:
                user_data = response.json()
                if user_data.get('username') == 'admin':
                    details += f", Authenticated as: {user_data['username']}"
                    self.log_test("Auth verification (/auth/me)", True, details)
                    return True
                else:
                    self.log_test("Auth verification (/auth/me)", False, "Wrong user data")
                    return False
            except:
                self.log_test("Auth verification (/auth/me)", False, "Invalid JSON response")
                return False
        else:
            self.log_test("Auth verification (/auth/me)", False, details)
            return False

    def test_public_endpoints(self):
        """Test public API endpoints"""
        print("\n🌐 Testing Public API Endpoints...")
        
        # Test menu endpoint
        success, response, details = self.test_endpoint('GET', 'menu', 200)
        if success:
            try:
                menu_items = response.json()
                categories = set(item.get('category') for item in menu_items)
                details += f", Categories: {sorted(categories)}"
            except:
                pass
        self.log_test("Get menu items (/menu)", success, details)
        
        # Test opening hours
        success, response, details = self.test_endpoint('GET', 'hours', 200)
        if success:
            try:
                hours = response.json()
                days = [h.get('day') for h in hours]
                details += f", Days: {len(days)}"
            except:
                pass
        self.log_test("Get opening hours (/hours)", success, details)
        
        # Test contact info
        success, response, details = self.test_endpoint('GET', 'contact', 200)
        if success:
            try:
                contact = response.json()
                if contact.get('phone') and contact.get('address'):
                    details += f", Phone: {contact.get('phone')}"
            except:
                pass
        self.log_test("Get contact info (/contact)", success, details)
        
        # Test gallery
        success, response, details = self.test_endpoint('GET', 'gallery', 200)
        if success:
            try:
                gallery = response.json()
                details += f", Images: {len(gallery)}"
            except:
                pass
        self.log_test("Get gallery images (/gallery)", success, details)

    def test_admin_menu_management(self):
        """Test admin menu management"""
        print("\n📋 Testing Admin Menu Management...")
        
        # Test creating a new menu item
        new_item = {
            "name": "Test Supp",
            "description": "Test kirjeldus",
            "price": "€5",
            "category": "soups"
        }
        
        success, response, details = self.test_endpoint(
            'POST', 'admin/menu', 200, new_item
        )
        
        created_item_id = None
        if success:
            try:
                created_item = response.json()
                created_item_id = created_item.get('id')
                details += f", Created ID: {created_item_id}"
            except:
                pass
        
        self.log_test("Create menu item (/admin/menu)", success, details)
        
        # Test updating the menu item if creation was successful
        if created_item_id:
            updated_item = {
                "name": "Updated Test Supp",
                "description": "Updated kirjeldus",
                "price": "€6",
                "category": "soups"
            }
            
            success, response, details = self.test_endpoint(
                'PUT', f'admin/menu/{created_item_id}', 200, updated_item
            )
            self.log_test("Update menu item (/admin/menu/{id})", success, details)
            
            # Test deleting the menu item
            success, response, details = self.test_endpoint(
                'DELETE', f'admin/menu/{created_item_id}', 200
            )
            self.log_test("Delete menu item (/admin/menu/{id})", success, details)

    def test_admin_hours_management(self):
        """Test admin opening hours management"""
        print("\n🕐 Testing Admin Hours Management...")
        
        # Test updating opening hours
        hours_update = {
            "day": "Esmaspäev",
            "hours": "10:00 – 16:00",
            "is_closed": False
        }
        
        success, response, details = self.test_endpoint(
            'PUT', 'admin/hours/Esmaspäev', 200, hours_update
        )
        self.log_test("Update opening hours (/admin/hours/{day})", success, details)

    def test_admin_contact_management(self):
        """Test admin contact management"""
        print("\n📞 Testing Admin Contact Management...")
        
        # Test updating contact info
        contact_update = {
            "address": "Maarjamõisa tee 11, Aravete alevik, 73501 Järva maakond",
            "phone": "+372 5804 1520",
            "facebook": "https://www.facebook.com/profile.php?id=100063569081108",
            "email": "info@ketekohvik.ee"
        }
        
        success, response, details = self.test_endpoint(
            'PUT', 'admin/contact', 200, contact_update
        )
        self.log_test("Update contact info (/admin/contact)", success, details)

    def test_admin_gallery_management(self):
        """Test admin gallery management"""
        print("\n🖼️ Testing Admin Gallery Management...")
        
        # Test adding a new gallery image
        new_image = {
            "url": "https://example.com/test-image.jpg",
            "alt": "Test image",
            "order": 999
        }
        
        success, response, details = self.test_endpoint(
            'POST', 'admin/gallery', 200, new_image
        )
        
        created_image_id = None
        if success:
            try:
                created_image = response.json()
                created_image_id = created_image.get('id')
                details += f", Created ID: {created_image_id}"
            except:
                pass
        
        self.log_test("Add gallery image (/admin/gallery)", success, details)
        
        # Test deleting the gallery image if creation was successful
        if created_image_id:
            success, response, details = self.test_endpoint(
                'DELETE', f'admin/gallery/{created_image_id}', 200
            )
            self.log_test("Delete gallery image (/admin/gallery/{id})", success, details)

    def test_logout(self):
        """Test admin logout"""
        print("\n🚪 Testing Admin Logout...")
        
        success, response, details = self.test_endpoint('POST', 'auth/logout', 200)
        self.log_test("Admin logout (/auth/logout)", success, details)

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🧪 KETE Kohvik Backend API Testing")
        print("=" * 50)
        print(f"Testing against: {self.base_url}")
        print(f"Admin credentials: {self.admin_credentials['username']}")
        if not self.admin_credentials["password"]:
            print("❌ Missing ADMIN_TEST_PASSWORD environment variable")
            return False
        
        # Test admin authentication first
        if not self.test_admin_login():
            print("\n❌ Admin login failed - stopping tests")
            return False
        
        # Test auth verification
        if not self.test_auth_me():
            print("\n❌ Auth verification failed - stopping tests")
            return False
        
        # Test public endpoints
        self.test_public_endpoints()
        
        # Test admin functionality
        self.test_admin_menu_management()
        self.test_admin_hours_management()
        self.test_admin_contact_management()
        self.test_admin_gallery_management()
        
        # Test logout
        self.test_logout()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 Backend API tests PASSED!")
            return True
        else:
            print("⚠️ Backend API tests have issues")
            return False

def main():
    """Main test runner"""
    tester = KETEKohvikAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
