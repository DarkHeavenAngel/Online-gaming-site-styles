# How to run project

### **Option 1:** Open directly in browser
1. Double-click on the ```public.html``` file.
2. Make sure the port the app runs on ```(63342)``` is listed in ```Online_gaming_site/settings.py``` under ```CORS_ORIGIN_WHITELIST``` (If needed, update CORS_ORIGIN_WHITELIST to allow requests from your frontend).

### **Option 2:** Run a lightweight Python server
1. Open a terminal in the frontend project folder.
2. Run the Python HTTP server: ```python -m http.server 63342```
