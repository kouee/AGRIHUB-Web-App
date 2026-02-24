# AGRIHUB: Hydroponic Monitoring & Automation System

This is a website with a dashboard for the AGRIHUB Project.

## Getting Started Locally

To run this project on your local machine, follow these steps:

### 1. Prerequisites

- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed (which includes npm). 
- **Visual Studio Code**: It is highly recommended to use [Visual Studio Code](https://code.visualstudio.com/) (the blue icon, not the purple Visual Studio).

### 2. Setup & Installation

**Step 1: Verify Node.js Installation**
After installing Node.js, open your terminal (or PowerShell on Windows) and check that it was installed correctly by typing `node -v` and `npm -v`. You should see version numbers for both.

**Step 2: Configure PowerShell (For Windows Users)**
If `npm` commands fail in the terminal later on, you may need to adjust your execution policy. To do this:
1.  Search for **PowerShell** in your Start Menu, right-click it, and select "Run as administrator".
2.  In the PowerShell window, run the following command:
    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    ```
3.  When prompted, press `Y` and then Enter.
4.  Restart your computer or at least Visual Studio Code for the changes to take effect.

**Step 3: Open the Project**
1.  Download or clone the project files from GitHub to your computer.
2.  Open Visual Studio Code.
3.  From the top menu bar, select `File > Open Folder...`.
4.  Navigate to where you saved the project and select the main `AGRIHUB` folder.

**Step 4: Install Dependencies**
1.  Once the folder is open in VS Code, open the integrated terminal by going to `Terminal > New Terminal` in the top menu.
2.  In the terminal window that appears, run the following command. This will install all the necessary packages for the project to run.
    ```bash
    npm install
    ```

### 3. Run the Development Server

This command starts the main web application. All visual components, charts, and the dashboard will work with this server running.

```bash
npm run dev
```

The app will be available at [http://localhost:9002](http://localhost:9002).

## Updating the Dashboard Data

The dashboard visualizes data from a JSON file. To use your own data, follow these steps:

### 1. Prepare Your Data File

Your data must be in a JSON file with a specific structure. The file should contain an object where keys are dates in `"YYYY-MM-DD"` format. Each date key should hold another object where keys are times in `"HH:mm:ss"` format.

Here is an example of the required format for a single data entry:

```json
{
  "2026-02-14": {
    "07:32:28": {
      "timestamp": "2026/02/14 07:32:28",
      "ec_value": "1.89",
      "ph_value": "5.46",
      "water_temp": "22.7",
      "lux_value": "1351",
      "humidity": "88.5",
      "surround_temp": "21.3",
      "water_level": "HIGH",
      "dosing_pump": "off"
    }
  }
}
```

**Important:** Ensure all values are strings. The system will handle converting them to numbers where needed. Missing values can be represented as `"N/A"`.

### 2. Update the Data Source

1.  Place your new JSON data file inside the `src/app/data/` directory. For example, `my-new-data.json`.
2.  Open the file `src/components/dashboard.tsx`.
3.  Find the following import line at the top of the file:
    ```javascript
    import hydroponicsData from '@/app/data/hydroponics-data-nov-to-feb.json';
    ```
4.  Change the file path to point to your new data file:
    ```javascript
    import hydroponicsData from '@/app/data/my-new-data.json';
    ```
5.  Save the file. The dashboard will automatically reload and display your new data.
