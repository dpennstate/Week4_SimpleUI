Setup:
1. After pulling the project, run npm install to download and install packages and to create a package-lock.json
2. You will need to get a GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET setup in config.ts file.
3. First go to https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
4. Click on Configure a project
5. Create a new project or choose an existing Project
6. Click NEXT button
7. Select that you are choosing from a Web browser
8. DO NOT put any Authorized Javascript Origin. There is a bug in this UI that does not allow you to add http://localhost nor http://localhost:3000.
9. Click on CREATE
10. DO NOT copy the keys. We will not be using this one that you just created. We will instead be using one that Google Auto Generated after creating this one.
11. Click on API to go to the Google Cloud API & Services
12. This part may or may not be somewhat buggy. I experienced inconsistency when trying to view data on this page.
13. Go to Credentials
14. You should see both the OAuth client you created and something called "Web client (Auto-created for Google Sign-in)
15. For a reason I do not understand, the one you created cannot be used (at least not in local)
16. Click on the one that has "Web client (Auto-created for Google Sign-in)"
17. You should see a section for Authorized JavaScript origins
18. Click ADD URI
19. Add http://localhost:3000
20. Click ADD URI again
21. Add http://localhost
22. Make sure to click SAVE at the bottom of the page and confirm changes saved successfully
23. Copy the Client ID under Additional Information
24. Paste it within the quotes after GOOGLE_CLIENT_ID in config.ts file in the UI project
25. Copy the Client secret
26. Paste it within the quotes after GOOGLE_CLIENT_SECRET in config.ts file in the UI project
27. These two variables exist and are referenced when logging in so Google understands you have permission to use its Log In OAuth2 API service.
28. This UI requires the use of 3 APIs with each of their own setup to work fully. Make sure to change the APIs localhost for each to match with what is in config as they cannot all be 8080.
29. Social Media API: https://github.com/dpennstate/Week2_Backend
30. Employee RESTful API: https://github.com/dpennstate/RESTful_API_with_CRUD_Operations_backend
31. Open Weather 3rd Party API: https://github.com/dpennstate/consume_3rd_party_api_backend
32. Run npm start within your terminal or click the Play button in your IDE
33. Go to localhost:3000 or whatever default localhost is setup for your project
34. You can now login through Google OAuth2 API service as well as communicate with Employee RESTful API and Open Weather 3rd Party API
