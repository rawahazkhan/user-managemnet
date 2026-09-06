# User Management - Login & Dashboard

A lightweight, minimal-code login page with session management and a landing dashboard.

## Features
- **Minimal Codebase**: Pure HTML5, modern CSS3, and vanilla JavaScript (no npm dependencies or build tools needed).
- **Authentication**: Validation, password visibility toggle, error handling, and session persistence via `sessionStorage`.
- **Landing Dashboard**: Responsive overview with live user profile, system status indicator, active session timer, and quick action controls.
- **Log Out Flow**: Easily terminate the active session and return to the login screen.

## Demo Credentials
| Username | Password | Role |
| :--- | :--- | :--- |
| `admin` | `admin123` | Administrator |
| `user` | `user123` | Standard User |

## How to Run

### Option 1: Direct in Browser (Zero Setup)
Simply double-click [`index.html`](./index.html) or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Option 2: Local HTTP Server (Optional)
If you prefer running through a local development server:
```bash
# Using Python
python -m http.server 3000

# Or using npx
npx serve .
```
Then open `http://localhost:3000` in your browser.