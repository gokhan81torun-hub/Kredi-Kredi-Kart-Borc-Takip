# Design Document

## Overview

The offline PIN authentication system replaces the current online login with a secure, locally-stored authentication mechanism. The system consists of two main screens: an initial setup screen for first-time users and a PIN lock screen for returning users. All authentication data is stored locally using browser localStorage, ensuring the application works completely offline.

## Architecture

The authentication system follows a state-based architecture:

1. **Application State Detection**: On startup, check localStorage for setup completion
2. **Conditional Screen Rendering**: Show setup or PIN lock based on state
3. **Local Data Persistence**: Store user credentials and preferences in localStorage
4. **Security Layer**: PIN-based access control with visual feedback

## Components and Interfaces

### Setup Screen Component
- **Purpose**: Initial user onboarding and credential creation
- **Inputs**: User name (text), 4-digit PIN (numeric)
- **Validation**: Name length (min 2 chars), PIN format (exactly 4 digits)
- **Output**: Stored credentials in localStorage, navigation to main app

### PIN Lock Screen Component
- **Purpose**: Secure authentication for returning users
- **Inputs**: 4-digit PIN via virtual NumPad
- **Visual Elements**: PIN indicators (4 circles), NumPad (3x4 grid)
- **Output**: Authentication success/failure, app unlock/error feedback

### Virtual NumPad Component
- **Layout**: 3x4 grid (digits 1-9, 0, and optional action buttons)
- **Interaction**: Touch-friendly buttons with visual feedback
- **Events**: Digit entry, PIN completion, validation trigger

### PIN Indicator Component
- **Visual**: 4 circular indicators showing entry progress
- **States**: Empty (default), Filled (digit entered), Error (shake animation)
- **Styling**: Neon green fill, smooth transitions

## Data Models

### User Setup Data
```javascript
{
  userName: string,        // User's display name
  userPin: string,         // 4-digit PIN (stored as string)
  isSetupDone: boolean,    // Setup completion flag
  setupDate: string        // ISO date of setup completion
}
```

### Authentication State
```javascript
{
  isAuthenticated: boolean,  // Current session authentication status
  currentPinEntry: string,   // Current PIN being entered
  attemptCount: number,      // Failed attempt counter
  lastAttempt: string        // Timestamp of last attempt
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Setup data persistence
*For any* valid user name and PIN combination, storing setup data should result in retrievable data from localStorage
**Validates: Requirements 1.2**

Property 2: PIN validation consistency
*For any* 4-digit PIN entry, validation should return the same result when compared against stored credentials
**Validates: Requirements 2.3, 2.4**

Property 3: Visual feedback synchronization
*For any* digit entry on the NumPad, the corresponding PIN indicator should update to reflect the current state
**Validates: Requirements 2.5, 3.3, 5.2**

Property 4: Input validation enforcement
*For any* PIN input with length not equal to 4 digits, the system should prevent authentication attempts
**Validates: Requirements 1.5**

Property 5: Data preservation during logout
*For any* logout operation, all user data in localStorage should remain unchanged after page reload
**Validates: Requirements 4.2, 4.3**

Property 6: NumPad interaction feedback
*For any* NumPad button press, the system should provide immediate visual feedback with neon green highlighting
**Validates: Requirements 3.2, 6.3**

Property 7: Authentication state consistency
*For any* successful PIN entry, the system should transition from locked to unlocked state and show the main application
**Validates: Requirements 2.3**

Property 8: Error feedback and reset
*For any* incorrect PIN entry, the system should show error feedback and reset the PIN input to empty state
**Validates: Requirements 2.4, 5.3**

## Error Handling

### Input Validation Errors
- **Empty Name**: Display "Lütfen adınızı giriniz" message
- **Short PIN**: Display "PIN 4 haneli olmalıdır" message
- **Invalid Characters**: Prevent non-numeric input in PIN fields

### Authentication Errors
- **Wrong PIN**: Shake animation + "Yanlış PIN" message
- **Multiple Failures**: Temporary lockout after 5 failed attempts
- **Storage Errors**: Fallback to session-based authentication

### System Errors
- **localStorage Unavailable**: Display warning and use sessionStorage
- **Data Corruption**: Reset to setup screen with data recovery option
- **Performance Issues**: Debounce rapid inputs, optimize animations

## Testing Strategy

### Unit Testing
- Input validation functions
- localStorage operations
- PIN comparison logic
- State management functions

### Property-Based Testing
The testing framework will be **fast-check** for JavaScript property-based testing, configured to run a minimum of 100 iterations per property.

Each property-based test will be tagged with comments referencing the design document properties:
- **Feature: offline-pin-authentication, Property 1: Setup data persistence**
- **Feature: offline-pin-authentication, Property 2: PIN validation consistency**
- And so forth for all 8 properties

### Integration Testing
- Complete setup flow testing
- Authentication flow testing
- Logout and re-authentication testing
- Cross-browser localStorage compatibility

### Visual Testing
- NumPad layout and responsiveness
- PIN indicator animations
- Theme consistency verification
- Touch interaction testing on mobile devices