# test_api.py - Test script to verify the API
import requests
import time
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test if server is running"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Server is running")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        print("   Run: uvicorn main:app --reload")
        return False


def test_upload_file(filepath: str, test_name: str):
    """Test file upload"""
    print("\n" + "="*60)
    print(f"TEST: {test_name}")
    print("="*60)
    try:
        with open(filepath, 'rb') as f:
            files = {'file': (filepath, f)}
            response = requests.post(f"{BASE_URL}/api/v1/scan/upload", files=files)
        
        if response.status_code == 200:
            result = response.json()
            task_id = result['task_id']
            print(f"✅ File uploaded successfully")
            print(f"   Task ID: {task_id}")
            print(f"   Message: {result['message']}")
            
            # Wait a bit for processing
            time.sleep(1)
            
            # Get result
            result_response = requests.get(f"{BASE_URL}/api/v1/scan/result/{task_id}")
            if result_response.status_code == 200:
                scan_result = result_response.json()
                print(f"\n📊 SCAN RESULT:")
                print(f"   File ID: {scan_result['file_id']}")
                print(f"   Filename: {scan_result['filename']}")
                print(f"   Fraud Score: {scan_result['fraud_score']}")
                print(f"   Severity: {scan_result['severity']}")
                print(f"   Processing Time: {scan_result['processing_time']}ms")
                
                if scan_result['anomalies']:
                    print(f"\n⚠️  ANOMALIES DETECTED:")
                    for i, anomaly in enumerate(scan_result['anomalies'], 1):
                        print(f"   {i}. {anomaly['type']}")
                        print(f"      → {anomaly['description']}")
                else:
                    print(f"\n✅ No anomalies detected")
                
                return scan_result
            else:
                print(f"❌ Failed to get result: {result_response.status_code}")
                return None
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
        print(f"   Please create a test file or update the path")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_duplicate_detection():
    """Test duplicate detection by uploading same file twice"""
    print("\n" + "="*60)
    print("TEST: Duplicate Detection")
    print("="*60)
    
    # Create a simple test file
    test_content = b"This is a test invoice for duplicate detection. Invoice #12345."
    
    # Upload first time
    print("\n📤 Uploading file first time...")
    files = {'file': ('test_invoice_1.txt', test_content)}
    response1 = requests.post(f"{BASE_URL}/api/v1/scan/upload", files=files)
    
    if response1.status_code == 200:
        task1 = response1.json()['task_id']
        print(f"✅ First upload successful - Task ID: {task1}")
        
        # Wait a bit
        time.sleep(1)
        
        # Upload same content with different filename
        print("\n📤 Uploading same content again...")
        files = {'file': ('test_invoice_2.txt', test_content)}
        response2 = requests.post(f"{BASE_URL}/api/v1/scan/upload", files=files)
        
        if response2.status_code == 200:
            task2 = response2.json()['task_id']
            print(f"✅ Second upload successful - Task ID: {task2}")
            
            # Get second result
            result2 = requests.get(f"{BASE_URL}/api/v1/scan/result/{task2}").json()
            
            if result2['anomalies'] and 'Duplicate' in str([a['type'] for a in result2['anomalies']]):
                print(f"\n✅ DUPLICATE DETECTED!")
                print(f"   Severity: {result2['severity']}")
            else:
                print(f"\n⚠️  No exact duplicate detected (may be expected)")
                print(f"   Severity: {result2['severity']}")
        else:
            print(f"❌ Second upload failed")
    else:
        print(f"❌ First upload failed")


def main():
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*15 + "AP FraudShield API Tests" + " "*20 + "║")
    print("╚" + "="*58 + "╝")
    
    # Test 1: Health check
    if not test_health_check():
        return
    
    # Test 2: Duplicate detection
    test_duplicate_detection()
    
    # Test 3: Upload various file types (if they exist)
    print("\n\n" + "="*60)
    print("OPTIONAL TESTS (if you have test files)")
    print("="*60)
    print("\nTo test file uploads, create test files and uncomment below:\n")
    
    # Uncomment and add your test files:
    # test_upload_file("test_files/invoice.pdf", "PDF Upload Test")
    # test_upload_file("test_files/document.docx", "DOCX Upload Test")
    # test_upload_file("test_files/spreadsheet.xlsx", "XLSX Upload Test")
    # test_upload_file("test_files/image.jpg", "Image Upload Test")
    
    print("\n" + "="*60)
    print("TESTS COMPLETED")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
