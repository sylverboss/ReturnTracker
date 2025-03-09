# ReturnTracker Documentation

## Overview

ReturnTracker is a mobile application designed to help users manage product returns from online purchases. The app tracks return deadlines, provides return instructions, and sends timely reminders to ensure users don't miss return windows.

## App Structure

The app is built using Expo and Expo Router, with a tab-based navigation structure:

### Main Navigation

- **Home**: Dashboard showing active returns with urgency indicators
- **Returns**: Comprehensive list of all returns with filtering options
- **Add**: Quick access to add new returns (opens a modal)
- **Analytics**: Charts and statistics about return history and savings
- **Profile**: User settings and subscription management

### Secondary Screens

- **Add Return**: Modal for adding new returns manually
- **Forward Email**: Instructions for forwarding purchase confirmation emails
- **Return Processing**: Animation screen for processing return information
- **Return Details**: Detailed view of a specific return
- **Return Instructions**: Step-by-step guidance for completing returns

## Database Schema

The application uses a PostgreSQL database with the following structure:

### Core Tables

#### Profiles
- Stores user information and preferences
- Primary key: `id` (UUID, linked to Auth user)
- Notable fields: email, name, display_name, avatar_url, preferences (JSONB), is_premium, premium_expires_at, onboarding_completed
- Preferences stored as a JSON object with schema validation

#### Returns
- Contains all return requests made by users
- Primary key: `id` (UUID)
- Foreign key: `user_id` references profiles(id)
- Key fields: retailer_name, order_number, order_date, return_deadline, status (ENUM), refund_amount, refund_status (ENUM)
- Contains order_items as a JSONB field storing product details

#### Return Items
- Individual items within a return request
- Primary key: `id` (UUID)
- Foreign key: `return_id` references returns(id)
- Fields: name, description, quantity, price, item_img_url

#### Return Images
- Images associated with returns (receipts, products, labels)
- Primary key: `id` (UUID)
- Foreign key: `return_id` references returns(id)
- Fields: image_url, cloudinary_id, type (ENUM: receipt, product, label, qr_code, other)

### Supporting Tables

#### Retailers
- Information about retailers and their return policies
- Primary key: `id` (UUID)
- Fields: name, website, logo, return_policy (JSONB), email_domains

#### Drop Off Locations
- Locations where users can drop off their returns
- Primary key: `id` (UUID)
- Fields: name, address, coordinates (JSONB), carriers (array), hours, services (array)

#### Notifications
- Notifications sent to users about their returns
- Primary key: `id` (UUID)
- Foreign keys: `user_id` references profiles(id), `return_id` references returns(id)
- Fields: type (ENUM: reminder, status_update, deadline, confirmation), title, message, read, scheduled_for

#### Translations
- Multilingual content for the application
- Primary key: `key` (TEXT)
- Fields: english, spanish, french, german, italian, chinese

### Security and Access Control

- Row-Level Security (RLS) is enabled on all tables
- Policies ensure users can only access their own data
- Authentication is handled through Supabase Auth

### Data Relationships

- Each user (profile) can have multiple returns
- Each return can have multiple return items and images
- Notifications link to both users and specific returns
- Drop-off locations are used across multiple returns

## Features

### Return Tracking

- Color-coded urgency indicators (red, yellow, green)
- Countdown timers for return deadlines
- Status filtering (pending, in progress, completed)

### Return Detection

- Email forwarding for automated return information extraction
- Manual entry option for purchases without email confirmations

### Return Process Guidance

- Retailer-specific return instructions
- Drop-off location finder
- Return label generation
- Return confirmation tracking

### Analytics

- Money saved through successful returns
- Return history and patterns
- Retailer return policy comparisons

## UI Components

The app uses a consistent design system with the following components:

- Cards for displaying return information
- Filter tabs for categorizing returns
- Progress indicators for return steps
- Animated transitions between screens
- Color-coded badges for status and urgency

## Technologies Used

- **Expo**: React Native framework for cross-platform development
- **Expo Router**: File-based routing system
- **React Native Reanimated**: Advanced animations
- **Lucide React Native**: Icon library
- **Expo Linear Gradient**: Gradient effects
- **React Native Safe Area Context**: Safe area handling
- **Expo Blur**: Blur effects for iOS
- **Supabase**: Backend service for database, authentication, and storage

## Font System

The app uses the Inter font family with the following weights:
- Inter-Regular
- Inter-Medium
- Inter-SemiBold
- Inter-Bold

## Color Palette

- Primary Blue: #3B82F6
- Dark Text: #1F2937
- Medium Text: #4B5563
- Light Text: #6B7280
- Background: #F9FAFB
- Card Background: #FFFFFF
- Border Color: #F1F5F9
- Success Green: #22C55E
- Warning Yellow: #FFBB0E
- Error Red: #FF4D4D

## Future Enhancements

- Integration with retailer APIs for automated return processing
- Barcode/QR code scanning for quick return tracking
- Social sharing features for referral program
- Enhanced analytics with spending patterns
- Calendar integration for deadline visualization

## Deep Linking Testing Commands

```bash
# Test basic deep link with custom scheme
adb shell am start -a android.intent.action.VIEW -d "com.returntrackr://login" com.returntrackr

# Test deep link with parameters
adb shell am start -a android.intent.action.VIEW -d "com.returntrackr://login?confirmed=true&email=user@example.com" com.returntrackr

# Test HTTPS link (for Android App Links) - replace with your Supabase URL
adb shell am start -a android.intent.action.VIEW -d "https://orlbgscpjczraksivjrg.supabase.co/auth/v1/verify?token=YOUR_TOKEN&type=signup" com.returntrackr

# Test HTTP localhost link (for development)
adb shell am start -a android.intent.action.VIEW -d "http://localhost:8081/(auth)/login?confirmed=true" com.returntrackr

# Check installed intent filters (debugging)
adb shell dumpsys package com.returntrackr | grep -A 20 "Intent filters"

# Verify App Links are working (Android 6.0+)
adb shell pm get-app-links com.returntrackr

# Launch browser and navigate to a URL that should trigger App Links
adb shell am start -a android.intent.action.VIEW -d "https://orlbgscpjczraksivjrg.supabase.co/auth/v1/verify?token=TOKEN&type=signup"

# Clearing App Links verification (if needed for fresh testing)
adb shell cmd package verify-app-links --reset com.returntrackr
```