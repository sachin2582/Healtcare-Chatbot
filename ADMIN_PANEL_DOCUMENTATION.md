# Healthcare Chatbot Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive management system for the Healthcare Chatbot application. It provides administrators with the ability to manage doctors, specialties, time slots, and health packages through a user-friendly web interface.

## Features

### 🏥 Dashboard
- **Overview Statistics**: View total doctors, specialties, health packages, appointments, and patients
- **Real-time Metrics**: Monitor active appointments and system performance
- **Quick Access**: Navigate to different management sections

### 👨‍⚕️ Doctor Management
- **Add/Edit/Delete Doctors**: Complete CRUD operations for doctor profiles
- **Image Upload**: Upload and manage doctor profile pictures
- **Specialty Assignment**: Link doctors to specific medical specialties
- **Availability Control**: Enable/disable doctor availability
- **Contact Information**: Manage doctor contact details and qualifications

### 🩺 Specialty Management
- **Specialty Creation**: Add new medical specialties with descriptions
- **Icon Management**: Assign emoji icons to specialties for better UI representation
- **Active/Inactive Status**: Control specialty visibility in the system

### ⏰ Time Slot Management
- **Weekly Schedule Setup**: Configure doctor availability for each day of the week
- **Flexible Time Slots**: Set custom start/end times and slot durations
- **Visual Preview**: See generated time slots before saving
- **Bulk Operations**: Manage multiple time slots efficiently

### 📋 Health Package Management
- **Package Creation**: Design comprehensive health checkup packages
- **Test Management**: Add individual tests to packages with categories
- **Pricing Control**: Set package prices with optional original prices for discounts
- **Age/Gender Targeting**: Configure packages for specific demographics
- **Image Management**: Upload package images for better presentation

## Technical Architecture

### Backend Components

#### API Endpoints (`backend/admin_api.py`)
```
/admin/specialities          - CRUD operations for specialties
/admin/doctors               - CRUD operations for doctors
/admin/doctors/{id}/image    - Doctor image upload
/admin/doctors/{id}/time-slots - Time slot management
/admin/health-packages       - Health package CRUD
/admin/health-packages/{id}/tests - Package test management
/admin/dashboard/stats       - Dashboard statistics
```

#### Data Models (`backend/admin_schemas.py`)
- **SpecialityCreate/Update/Response**: Specialty management schemas
- **DoctorCreate/Update/Response**: Doctor management schemas
- **TimeSlotCreate/Update/Response**: Time slot schemas
- **HealthPackageCreate/Update/Response**: Package management schemas
- **HealthPackageTestCreate/Response**: Test management schemas

### Frontend Components

#### Main Dashboard (`frontend/src/components/admin/AdminDashboard.js`)
- Tabbed interface for different management sections
- Statistics cards with real-time data
- Navigation between management modules

#### Management Components
- **DoctorManagement.js**: Doctor CRUD operations with image upload
- **SpecialityManagement.js**: Specialty management interface
- **TimeSlotManagement.js**: Time slot configuration with preview
- **HealthPackageManagement.js**: Package and test management

#### Service Layer (`frontend/src/services/adminService.js`)
- Centralized API communication
- Error handling and validation
- Utility functions for data formatting

## Installation & Setup

### 1. Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Migration**:
   ```bash
   python migrate_database.py
   ```

3. **Start Backend Server**:
   ```bash
   python main.py
   ```

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Start Frontend Server**:
   ```bash
   npm start
   ```

### 3. Access Admin Panel

Navigate to: `http://localhost:3000/admin`

## Usage Guide

### Managing Doctors

1. **Adding a New Doctor**:
   - Click "Add Doctor" button
   - Fill in required information (name, specialization)
   - Select specialty from dropdown
   - Add qualification and experience details
   - Upload profile picture (optional)
   - Set availability status

2. **Editing Doctor Information**:
   - Click edit icon next to doctor
   - Modify information as needed
   - Save changes

3. **Managing Doctor Images**:
   - Click camera icon next to doctor avatar
   - Select image file (JPG, PNG supported)
   - Image will be automatically uploaded and displayed

### Managing Specialties

1. **Creating Specialties**:
   - Click "Add Speciality"
   - Enter specialty name (e.g., "Cardiology", "Neurology")
   - Add description
   - Choose emoji icon for visual representation
   - Set active status

2. **Organizing Specialties**:
   - Use descriptive names for easy identification
   - Add meaningful descriptions for patient understanding
   - Use appropriate medical emojis for visual appeal

### Configuring Time Slots

1. **Setting Up Doctor Schedules**:
   - Select doctor from dropdown
   - Click "Add Time Slot"
   - Choose day of week
   - Set start and end times
   - Configure slot duration (default: 30 minutes)
   - Preview generated slots before saving

2. **Time Slot Preview**:
   - View all generated time slots
   - See total number of available appointments
   - Edit or delete individual time slots

### Managing Health Packages

1. **Creating Health Packages**:
   - Click "Add Package"
   - Enter package name and description
   - Set pricing (current and original price for discounts)
   - Configure package details:
     - Duration in hours
     - Age group targeting
     - Gender specificity
     - Fasting requirements
     - Home collection availability
     - Report delivery timeline

2. **Adding Tests to Packages**:
   - Click "Add Test" within package dialog
   - Enter test name and category
   - Add test description
   - Mark as optional if applicable
   - Save test to package

3. **Package Management**:
   - Upload package images for better presentation
   - Edit package details and pricing
   - Activate/deactivate packages
   - Delete packages (if no bookings exist)

## API Reference

### Authentication
Currently, the admin panel doesn't require authentication. For production deployment, implement:
- JWT token-based authentication
- Role-based access control
- Session management

### Error Handling
All API endpoints return standardized error responses:
```json
{
  "detail": "Error message description"
}
```

### File Upload
Image uploads support:
- **Formats**: JPG, PNG, GIF
- **Size Limit**: 5MB maximum
- **Processing**: Automatic resizing and optimization

## Security Considerations

### Production Deployment
1. **Authentication**: Implement proper authentication system
2. **Authorization**: Add role-based access control
3. **HTTPS**: Use SSL certificates for secure communication
4. **Input Validation**: Server-side validation for all inputs
5. **File Upload Security**: Validate file types and scan for malware

### Data Protection
1. **Database Security**: Use connection encryption
2. **API Security**: Implement rate limiting and request validation
3. **Logging**: Comprehensive audit logging for all admin actions

## Troubleshooting

### Common Issues

1. **Image Upload Fails**:
   - Check file size (must be < 5MB)
   - Verify file format (JPG, PNG only)
   - Ensure backend is running

2. **Time Slots Not Generating**:
   - Verify start time is before end time
   - Check slot duration is reasonable (1-480 minutes)
   - Ensure doctor is selected

3. **Package Tests Not Saving**:
   - Verify all required fields are filled
   - Check package is saved before adding tests
   - Ensure no duplicate test names

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=True
```

## Future Enhancements

### Planned Features
1. **User Management**: Admin user accounts and permissions
2. **Audit Logging**: Track all admin actions
3. **Bulk Operations**: Import/export data functionality
4. **Analytics Dashboard**: Advanced reporting and analytics
5. **Mobile Responsiveness**: Optimize for tablet/mobile access
6. **Multi-language Support**: Internationalization
7. **Template System**: Predefined package templates
8. **Integration APIs**: Connect with external systems

### Performance Optimizations
1. **Caching**: Implement Redis caching for frequently accessed data
2. **Database Indexing**: Optimize database queries
3. **Image Optimization**: Automatic image compression and resizing
4. **Lazy Loading**: Implement pagination for large datasets

## Support

For technical support or feature requests:
1. Check the troubleshooting section
2. Review API documentation
3. Contact development team
4. Submit issue reports with detailed descriptions

## Version History

- **v1.0.0**: Initial admin panel release with basic CRUD operations
- **v1.1.0**: Added image upload functionality
- **v1.2.0**: Enhanced time slot management with preview
- **v1.3.0**: Improved health package management with test system

---

*This documentation is regularly updated. Please check for the latest version.*
