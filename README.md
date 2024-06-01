# Glucose Chart App

## Objective
This project is a web application developed to visualize Continuous Glucose Monitoring (CGM) data obtained from the LibreView API. The objective of this project is to provide a simple interface where users can log in to retrieve and view their CGM data. More features will be added in the future.

## Technologies Used
- **React**: Frontend library for building user interfaces.
- **Chart.js**: Library for rendering interactive line charts.
- **LibreView API**: Source for fetching CGM data via HTTP requests
- **chartjs-adapter-date-fns**: Adapter for integrating Chart.js with date-fns library.

## Skills Demonstrated
- **Frontend Development**: Developed the frontend of the application using React, including components for user authentication and data visualization.
- **API Integration**: Integrated LibreView API securely.
- **Data Visualization**: Implemented interactive charts with Chart.js.
- **Error Handling**: Implemented error handling mechanisms.

## Features
- **User Authentication**: The user can log in to the application using their Libre credentials.
- **Data Visualization**: Once authenticated, the application requests CGM data from the LibreView API and displays it as an interactive line chart.
- **Error Handling**: The application handles various error scenarios during authentication and data retrieval, displaying appropriate error messages.
- **Responsive Design**: The user interface is designed to be responsive and adapts to different screen sizes.

## Current Usage
1. **Login**: Enter your Libre username and password in the provided fields and click on the "Login" button.
2. **View Graph**: The application will fetch and display your CGM data as an interactive graph, as well as your average glucose level for the last 12 hours.
3. **Interact with Graph**: You can interact with the graph by hovering over data points to view glucose levels at specific times.

## Getting Started
To run the Glucose Chart App locally:
1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.
4. Access the application in your browser at `http://localhost:3000`.

## Credits
- The [LibreView API documentation](https://libreview-unofficial.stoplight.io/docs/libreview-unofficial/branches/main/5e6m44bnx0m4p-libre-view-unofficial) provided guidance for integrating CGM data retrieval into the application.
- This [GitHub Gist by khskekec](https://gist.github.com/khskekec/6c13ba01b10d3018d816706a32ae8ab2) was helpful in understanding the LibreView API integration.