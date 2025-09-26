# KongMindset - Troubleshooting Visibility Issues

## Common Issues and Solutions

### 1. Course Modules Not Showing
**Check:**
- Are you logged in? The modules only show after authentication
- Is the development server running? (`npm run dev`)
- Check browser console for errors (F12 → Console tab)

### 2. Authentication Problems
**Check:**
- Is Supabase configured? Look for `.env` file with:
  ```
  VITE_SUPABASE_URL=your_url_here
  VITE_SUPABASE_ANON_KEY=your_key_here
  ```
- If no `.env` file exists, you need to set up Supabase

### 3. Napoleon Hill AI Chatbot Not Visible
**Check:**
- Look for a blue brain icon in the bottom-right corner
- The chatbot loads after a few seconds on module pages
- Check if JavaScript is enabled in your browser

### 4. Content Not Loading After Login
**Check:**
- Browser console for errors
- Network tab in developer tools for failed requests
- Try refreshing the page

### 5. Styling Issues
**Check:**
- Are CSS files loading properly?
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

## Quick Diagnostic Steps

1. **Open Browser Developer Tools** (F12)
2. **Check Console Tab** for error messages
3. **Check Network Tab** for failed requests
4. **Verify you're on the correct URL** (usually http://localhost:5173)

## Current Project Status
- ✅ React app with TypeScript
- ✅ Tailwind CSS for styling  
- ✅ 13 course modules defined
- ✅ Authentication system (requires Supabase setup)
- ✅ Optimized database structure
- ✅ Purchase-to-registration flow
- ✅ AI chatbot integration
- ✅ Responsive design

## Database Structure (After Optimization)
- ✅ `simple_logins` - Webhook-created users with course access
- ✅ `user_profiles` - User profile data and preferences  
- ✅ `course_purchases` - Complete purchase tracking and audit trail
- ❌ Removed: `stripe_user_subscriptions` (not needed)
- ❌ Removed: `stripe_user_orders` (replaced by course_purchases)

## Authentication Flow
1. **Purchase** → User data stored in `simple_logins` + `course_purchases`
2. **Login Attempt** → Check auth.users first
3. **Fallback** → If not in auth.users, check `simple_logins`
4. **Auto-Create** → Create auth.users from simple_logins data
5. **Profile Creation** → Auto-create user_profiles entry
6. **Success** → User can access course immediately

## Need Help?
Tell me specifically what you're not seeing and I can provide targeted help!