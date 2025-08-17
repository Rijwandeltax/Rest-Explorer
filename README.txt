A chrome extension to help Salesforce Admins, Developers, and Consultants.
-----------------------------------------------
# RestExplore

**RestExplore** is a Chrome Extension for exploring REST APIs easily inside the browser.  
It provides a lightweight interface for sending REST API requests and viewing responses.

---

## 🚀 Features
- Send REST API requests directly from the extension
- Support for **GET, POST, PUT, DELETE** methods
- JSON response viewer
- Lightweight UI built with Bootstrap
- Uses jQuery & JSZip libraries
- Configurable options page
- Custom icons

---

## 📂 Project Structure

Files:
│── manifest.json # Extension configuration
│── background.js # Background script
│── popup.html # Popup UI
│── options.html # Options/settings
│── css/ # Stylesheets (Bootstrap, custom)
│── library/ # JavaScript libraries & scripts
│── icons/ # Extension icons

Install:
1. Open chrome://extensions, enable Developer mode
3. Click 'Load unpacked' and select the extension folder
4. Open a logged-in Salesforce tab, in SideBar Icon will show
5. 

Notes:
- If you get INVALID_SESSION_ID or 401, ensure the active tab is a logged-in Salesforce page and reload the extension.
- For production, consider implementing OAuth instead of using session cookie.

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.

