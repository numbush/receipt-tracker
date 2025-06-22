# Receipt Tracker API Testing Guide

This document provides examples for testing the Receipt Tracker API endpoints using Postman, Thunder Client, or curl.

## Base URL
```
http://localhost:3000/api
```

## Environment Setup

Before testing, make sure to:
1. Update your `.env.local` file with your actual MongoDB Atlas connection string
2. Start the development server: `npm run dev`

## API Endpoints

### 1. Upload Image
**POST** `/api/upload`

**Content-Type:** `multipart/form-data`

**Body (form-data):**
- `file`: (file) Select an image file (JPEG, PNG, WebP, max 10MB)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "filename": "receipt_1703123456789_abc123def456.jpg",
    "size": 245760,
    "type": "image/jpeg"
  }
}
```

### 2. Create Receipt
**POST** `/api/receipts`

**Content-Type:** `application/json`

**Body:**
```json
{
  "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "storeName": "Walmart",
  "amount": 45.67,
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "storeName": "Walmart",
    "amount": 45.67,
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 3. Get All Receipts
**GET** `/api/receipts`

**Query Parameters (all optional):**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: 'date')
- `sortOrder`: 'asc' or 'desc' (default: 'desc')
- `storeName`: Filter by store name (partial match)
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `startDate`: Start date filter (ISO string)
- `endDate`: End date filter (ISO string)

**Example URLs:**
```
GET /api/receipts
GET /api/receipts?page=1&limit=5
GET /api/receipts?storeName=walmart
GET /api/receipts?minAmount=20&maxAmount=100
GET /api/receipts?startDate=2024-01-01&endDate=2024-01-31
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
      "storeName": "Walmart",
      "amount": 45.67,
      "date": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 4. Get Single Receipt
**GET** `/api/receipts/{id}`

**Example:**
```
GET /api/receipts/65a1b2c3d4e5f6789012345
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
    "storeName": "Walmart",
    "amount": 45.67,
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 5. Update Receipt
**PUT** `/api/receipts/{id}`

**Content-Type:** `application/json`

**Body (partial update - include only fields to update):**
```json
{
  "storeName": "Target",
  "amount": 52.30
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
    "storeName": "Target",
    "amount": 52.30,
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:05:00.000Z"
  }
}
```

### 6. Delete Receipt
**DELETE** `/api/receipts/{id}`

**Example:**
```
DELETE /api/receipts/65a1b2c3d4e5f6789012345
```

**Example Response:**
```json
{
  "success": true,
  "message": "Receipt deleted successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "imageUrl": "/uploads/receipt_1703123456789_abc123def456.jpg",
    "storeName": "Target",
    "amount": 52.30,
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:05:00.000Z"
  }
}
```

## Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors, missing fields)
- `404`: Not Found (receipt not found)
- `500`: Internal Server Error (database or server errors)

## Testing Workflow

1. **Test Upload Endpoint**: Upload an image file first
2. **Create Receipt**: Use the imageUrl from upload response
3. **Get All Receipts**: Verify the receipt was created
4. **Get Single Receipt**: Test with the receipt ID
5. **Update Receipt**: Modify some fields
6. **Delete Receipt**: Clean up test data

## cURL Examples

### Upload Image
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/your/receipt.jpg"
```

### Create Receipt
```bash
curl -X POST http://localhost:3000/api/receipts \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "/uploads/receipt_example.jpg",
    "storeName": "Test Store",
    "amount": 25.99,
    "date": "2024-01-15T10:30:00.000Z"
  }'
```

### Get All Receipts
```bash
curl -X GET http://localhost:3000/api/receipts
```

### Get Single Receipt
```bash
curl -X GET http://localhost:3000/api/receipts/RECEIPT_ID_HERE
```

### Update Receipt
```bash
curl -X PUT http://localhost:3000/api/receipts/RECEIPT_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Updated Store Name",
    "amount": 30.99
  }'
```

### Delete Receipt
```bash
curl -X DELETE http://localhost:3000/api/receipts/RECEIPT_ID_HERE
