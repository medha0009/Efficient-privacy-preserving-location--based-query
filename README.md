# EPLQ: Efficient Privacy-Preserving Location-Based Query System

## Project Overview
EPLQ is a privacy-preserving location-based service (LBS) system that allows users to search for Points of Interest (POIs) while protecting their location privacy. The system implements encryption for POI data and provides spatial range queries with privacy protection.

## Features
- Secure admin and user authentication
- Encrypted POI data storage
- Privacy-preserving location queries
- Distance-based POI search
- Secure logging system
- Real-time data encryption/decryption

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Firebase (Authentication, Firestore)
- Security: Custom encryption implementation
- Hosting: Firebase Hosting

## Project Structure
```
EPLQ/
├── admin.html         # Admin interface
├── admin.js          # Admin functionality
├── user.html         # User interface
├── user.js          # User functionality
├── firebase-config.js # Firebase configuration
├── styles.css        # Styling
└── js/
    └── encryption.js  # Encryption utilities
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Firebase account
- Modern web browser
- Live Server extension for VS Code (or similar)

### Firebase Setup
1. Create a new Firebase project
2. Enable Email/Password Authentication
3. Create a Firestore database
4. Add the following Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /pois/{poiId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /logs/{logId} {
      allow write: if request.auth != null;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Local Development Setup
1. Clone the repository
2. Open the project in VS Code
3. Start Live Server
4. Access the application at `http://localhost:5500`

## Usage Guide

### Admin Portal (admin.html)
1. Register as an admin
2. Login with admin credentials
3. Add POI data:
   - POI Name
   - POI Details
   - Latitude
   - Longitude

### User Portal (user.html)
1. Register as a user
2. Login with user credentials
3. Search for POIs:
   - Enter your latitude
   - Enter your longitude
   - Specify search radius (in kilometers)
4. View decrypted POI results within the specified radius

## Privacy Features
- POI data is encrypted before storage
- Location queries preserve user privacy
- Secure key management
- Role-based access control
- Action logging for security audit

## Distance Calculation
The system uses the Haversine formula to calculate accurate Earth-surface distances between points, ensuring precise spatial queries.

## Security Implementation
- Client-side encryption of POI data
- Base64 encoding for encrypted data storage
- Key cycling for enhanced security
- Secure authentication flow
- Role-based authorization

## Error Handling
- Input validation
- Authentication error handling
- Database operation error handling
- Encryption/decryption error handling

## Logging
The system maintains logs for:
- User registration
- Admin registration
- POI uploads
- Search operations

## Development Notes
- Built with modern ES6+ JavaScript
- Uses Firebase SDK version 11.0.1
- Implements modular code structure
- Follows secure coding practices

## Testing
To test the system:
1. Register an admin account
2. Add several POIs with different locations
3. Register a user account
4. Test search functionality with various radii
5. Verify data encryption/decryption

## Future Enhancements
- Advanced encryption methods
- Batch POI upload
- User location history
- Enhanced search filters
- Mobile responsiveness
- Export/Import POI data

## Troubleshooting
If experiencing issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Ensure all security rules are properly set
4. Clear browser cache if needed
5. Verify internet connectivity

## Contributors
- Initial implementation
- Based on EPLQ research paper concepts
- Privacy-preserving location query implementation

## License
This project is proprietary and confidential.