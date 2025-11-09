# Email Threads - Quick Start Guide

## 🚀 Access the Feature

1. **Start the application:**
   ```bash
   cd procurement-app
   npm start
   ```

2. **Navigate to Email Threads:**
   - Click "Email Threads" in the sidebar (under Procurement section)
   - Or go directly to: `http://localhost:4200/emails`

## 📧 Email List Page

### What You'll See
- Grid showing all email threads
- Each row displays:
  - PO Number (e.g., PO-2025-0001)
  - Subject
  - Sender email
  - Status badge (color-coded)
  - Type icon (person/robot)
  - Received date
  - View button

### Available Actions

**Filter Emails:**
- Recent (7 days) - Default view
- Procurement Only - Only procurement-related emails
- Pending Response - Emails waiting for user confirmation
- Completed - Finished conversations

**Search:**
- Type in search box and press Enter
- Searches subject and body content
- Case-insensitive

**View Thread:**
- Click "View" button on any row
- Opens detailed conversation view

**Refresh:**
- Click "Refresh" button to reload data

## 💬 Email Thread Detail Page

### What You'll See

**Statistics Card:**
- Total emails in thread
- Procurement emails count
- System emails count
- Number of participants
- List of all participants
- First and last email dates

**Conversation View:**
- Nested email hierarchy
- Indented replies (shows conversation flow)
- Each email shows:
  - Sender and recipient
  - Timestamp
  - Status badge
  - Subject
  - Message content
  - "View Raw Content" (expandable)

### Available Actions

**Back:**
- Click back arrow to return to email list

**Refresh:**
- Click "Refresh" to reload thread

**Expand Raw Content:**
- Click "View Raw Content" to see original email with formatting

## 🎨 Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| EMAIL_RECEIVED | Gray | Just arrived |
| CLASSIFIED | Blue | AI classified |
| RECOMMENDATIONS_SENT | Amber | Waiting for user |
| CONFIRMATION_RECEIVED | Violet | User confirmed |
| PO_GENERATED | Green | PO created |
| COMPLETION_SENT | Indigo | Process complete |
| NOT_PROCUREMENT | Gray | Not procurement |
| ERROR | Red | Error occurred |

## 🔍 Example Workflows

### View Recent Emails
1. Go to `/emails`
2. Default filter shows last 7 days
3. Browse the list

### Find Specific Email
1. Go to `/emails`
2. Type search term (e.g., "mouse")
3. Press Enter
4. Results show matching emails

### View Full Conversation
1. Find email in list
2. Click "View" button
3. See complete thread with all replies
4. Scroll to see nested conversations

### Check Pending Requests
1. Go to `/emails`
2. Select "Pending Response" filter
3. See all emails waiting for user action

## 🧪 Test with Sample Data

If your backend has sample data, try these:

```bash
# View all emails
http://localhost:4200/emails

# View specific thread (replace with actual PO number)
http://localhost:4200/emails/thread/PO-2025-0001
```

## 📱 Responsive Design

- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu

## ⚡ Performance Tips

- Grid uses pagination (20 items per page)
- Hierarchy view caches results
- Use filters to narrow results
- Search is optimized for speed

## 🐛 Troubleshooting

**No emails showing:**
- Check backend is running on port 8080
- Verify proxy configuration
- Check browser console for errors

**Search not working:**
- Ensure search term is not empty
- Try different keywords
- Check network tab for API calls

**Thread not loading:**
- Verify PO number exists
- Check backend logs
- Try refreshing the page

## 🔗 API Endpoints Used

The UI integrates with these backend endpoints:

- `GET /api/emails/recent?days=7` - Recent emails
- `GET /api/emails/procurement` - Procurement only
- `GET /api/emails/state/{state}` - By status
- `GET /api/emails/search?query={q}` - Search
- `GET /api/emails/po/{poNumber}/hierarchy` - Thread view
- `GET /api/emails/po/{poNumber}/stats` - Statistics

## 📚 More Information

- [Complete API Documentation](../EMAIL_THREAD_API.md)
- [Implementation Details](EMAIL_IMPLEMENTATION.md)
- [Full API Examples](API_EXAMPLES.md)

---

**Ready to use!** Navigate to the Email Threads page and start exploring your email conversations.
