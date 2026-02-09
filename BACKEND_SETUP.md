# Backend Server Setup & Troubleshooting

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the backend server**:
   ```bash
   npm run dev:backend
   ```

   You should see:
   ```
   Server running on http://localhost:3001
   ```

3. **In a separate terminal, start the frontend**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Error: "Cannot find module 'express'"
**Solution**: Install dependencies:
```bash
npm install
```

### Error: "Port 3001 is already in use"
**Solution**: Either:
- Stop the process using port 3001:
  ```bash
  # Find the process
  lsof -ti:3001
  # Kill it (replace PID with the number from above)
  kill -9 <PID>
  ```
- Or change the port in `server/index.js` (line 11)

### Error: "EADDRINUSE: address already in use"
**Solution**: Same as above - port 3001 is already in use.

### Server starts but frontend can't connect
**Check**:
1. Is the server actually running? Look for "Server running on http://localhost:3001"
2. Test the API directly:
   ```bash
   curl http://localhost:3001/api/transactions
   ```
3. Check browser console for CORS errors (shouldn't happen, but worth checking)

### Dependencies not installed
**Solution**: Run:
```bash
npm install express cors concurrently
```

## Verify Server is Working

Test the API endpoint:
```bash
curl http://localhost:3001/api/transactions
```

You should see JSON data with your transactions.

## Alternative: Run Both Together

If you want to run both frontend and backend with one command:
```bash
npm run dev:all
```

This requires `concurrently` to be installed (it's in package.json).



