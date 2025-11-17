# Hunar AI Agent Creator

This project provides a simple UI to create and configure Sales Qualification Agents for the Hunar AI Voice API. It features a secure backend built to run on Google Cloud Run, ensuring your API key is never exposed to the client-side.

## Architecture

This application uses a secure, modern architecture:
1.  **Frontend**: A React application for configuring the agent.
2.  **Backend**: A Node.js service (in `/functions`) that acts as a secure proxy. It receives requests from the frontend, adds your secret Hunar AI API key, and forwards them to the Hunar AI API.

---

## Choose Your Deployment Method

This guide provides two paths to get your application live. Choose the one you're most comfortable with.

-   **[Option 1: Command-Line (CLI) Deployment](#quick-start-deploy-in-5-steps-via-cli)**: The fastest method for users comfortable with a terminal. Takes about 10 minutes.
-   **[Option 2: UI/Console Deployment](#ui-deployment-deploy-via-github-and-web-consoles)**: A visual, click-by-click method using the Google Cloud and Firebase web consoles. It requires setting up a GitHub repository but involves no terminal commands for deployment.

---

## Quick Start: Deploy in 5 Steps (via CLI)

**Goal:** Get your secure agent creator live using the command line.

#### **Prerequisites**
- **A Google Cloud Platform (GCP) Project with Billing Enabled:** This is the most common point of failure. Services like Cloud Run and Cloud Build (used for deployment) are not free. You **must** [link a valid billing account](https://console.cloud.google.com/billing) to your GCP project before you can deploy.
- Your Hunar AI API Key.
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) and [Firebase CLI (`firebase`)](https://firebase.google.com/docs/cli#install-cli-mac-linux-windows) are installed and authenticated.

---

### Step 1: Deploy the Secure Backend

This single command packages and deploys the backend code from the `functions/` directory to a secure, scalable service on Google Cloud Run.

1.  **Open your terminal** in the **root directory of this project**.
2.  **Run the deploy command**. Replace `[YOUR_REGION]` (e.g., `us-central1`) and `[YOUR_HUNAR_AI_KEY]`.

    ```bash
    gcloud run deploy hunar-agent-creator-service \
      --source functions/ \
      --platform managed \
      --region [YOUR_REGION] \
      --allow-unauthenticated \
      --set-env-vars HUNAR_API_KEY="[YOUR_HUNAR_AI_KEY]"
    ```

---

### Step 2: Copy the Backend URL

After the command in Step 1 succeeds, it will output a **Service URL**.

-   It will look like this: `https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app`
-   **Copy this URL.** You need it for the next step.

---

### Step 3: Configure the Frontend

You now need to tell the frontend where to send its requests.

1.  **Open the file:** `components/AgentForm.tsx`.
2.  **Paste the URL:** Find the `backendApiUrl` constant and replace the placeholder with the **Service URL** you just copied.

    ```tsx
    // Before:
    const backendApiUrl = 'https://YOUR_CLOUD_FUNCTION_URL_HERE';

    // After (example):
    const backendApiUrl = 'https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app';
    ```
3.  **Save the file.**

---

### Step 4: Deploy the Frontend

Now, let's publish the user interface to the web using Firebase Hosting.

1.  **Important:** Make sure your terminal is still in the **project's root directory**.
2.  **Link your GCP project to Firebase** (you only need to do this once):
    ```bash
    npx firebase projects:addfirebase [YOUR_GCP_PROJECT_ID]
    npx firebase use [YOUR_GCP_PROJECT_ID]
    ```
3.  **Deploy!**
    ```bash
    npx firebase deploy --only hosting
    ```

---

### Step 5: Use Your App!

The command in Step 4 will output a **Hosting URL** (e.g., `https://your-project-id.web.app`).

**This is the public URL for your live application!** Open it in your browser to start creating agents.

---
---

## UI Deployment: Deploy via GitHub and Web Consoles

This method uses the web interfaces for Google Cloud and Firebase, integrated with your GitHub repository, to deploy the application without using a terminal for deployment commands.

#### **Prerequisites**
-   **Code on GitHub:** You must have a copy of this project in your own GitHub repository. You can [fork this repository](https://github.com/new/fork) to get started.
-   **A Google Cloud Platform (GCP) Project with Billing Enabled:** This is essential. Services like Cloud Run and Cloud Build are not free. You **must** [link a valid billing account](https://console.cloud.google.com/billing) to your GCP project.
-   Your Hunar AI API Key.

---

### Step 1: Deploy the Secure Backend (via Google Cloud Console)

1.  **Navigate to Cloud Run:** Go to the [Google Cloud Run console](https://console.cloud.google.com/run).
2.  **Create Service:** Click the **"+ CREATE SERVICE"** button.
3.  **Configure Source:**
    *   Select **"Continuously deploy new revisions from a source repository"**.
    *   Click **"SET UP WITH CLOUD BUILD"**. This will open a side panel.
    *   Under "Repository provider", select **GitHub**. Authenticate and choose your repository containing the project code.
    *   In the "Build Settings" section:
        *   **Branch:** Select your main branch (e.g., `main`).
        *   **Build Type:** Choose **"Google Cloud Buildpacks"**.
        *   **Source location:** Enter `/functions` to specify that only the backend code should be built.
    *   Click **"Save"**.
4.  **Configure Service Settings:**
    *   **Service name:** Enter a name, for example, `hunar-agent-creator-service`.
    *   **Region:** Choose a region near you (e.g., `us-central1`).
    *   **Authentication:** Select **"Allow unauthenticated invocations"**.
5.  **Set API Key (Environment Variable):**
    *   Expand the **"Container(s), volumes, networking, security"** section.
    *   Go to the **"Variables & Secrets"** tab.
    *   Under "Environment variables", click **"+ ADD VARIABLE"**.
        *   **Name:** `HUNAR_API_KEY`
        *   **Value:** Paste your Hunar AI API key here.
6.  **Deploy:** Click **"CREATE"**. Google Cloud will now build the code from your `functions` directory and deploy it. This might take a few minutes.
7.  **Copy the Backend URL:** Once deployed, the service details page will show a **URL**. It will look like `https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app`. **Copy this URL.**

---

### Step 2: Configure and Deploy the Frontend (via Firebase Console & GitHub)

First, we'll tell the frontend code where the backend is.

1.  **Edit the Code:** In your local copy of the project (or directly on GitHub), open the file `components/AgentForm.tsx`.
2.  **Paste the URL:** Find the `backendApiUrl` constant and replace the placeholder with the **Service URL** you just copied from the previous step.
    ```tsx
    // Before:
    const backendApiUrl = 'https://YOUR_CLOUD_FUNCTION_URL_HERE';

    // After (example):
    const backendApiUrl = 'https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app';
    ```
3.  **Commit and Push:** Save the file and push this change to your main branch on GitHub.

Now, let's set up Firebase Hosting to automatically deploy these changes.

4.  **Go to Firebase:** Open the [Firebase Console](https://console.firebase.google.com/).
5.  **Add Project:** Click **"Add project"** and select your existing Google Cloud project from the dropdown list.
6.  **Navigate to Hosting:** In the left sidebar, go to **Build > Hosting**.
7.  **Get Started:** Click the **"Get started"** button. The setup wizard will show you CLI commands—we will use a different path.
8.  **Connect to GitHub:** Instead of following the CLI steps, find and click the option to connect to a different deployment source, such as GitHub. Set up a "GitHub Action" to deploy to Firebase Hosting.
9.  **Authorize and Select Repo:** Follow the prompts to authorize Firebase to access your GitHub account and select your project repository.
10. **Configure Deployment:**
    *   When asked for a build command, you can leave it blank as our project has no build step.
    *   When asked for the publish directory, enter `.` (a single dot) to specify the root directory.
    *   Enable automatic deployments.
11. **Save and Deploy:** Save the configuration. This will trigger the first deployment of your frontend.

---

### Step 3: Use Your App!

After the deployment is complete, the Firebase Hosting dashboard will show you a **Hosting URL** (e.g., `https://your-project-id.web.app`).

**This is the public URL for your live application!** Any future pushes to your main branch will automatically update the live site.

---

## (Optional but Recommended) Final Security Step

Right now, your backend accepts requests from anywhere. Let's lock it down so it only accepts requests from your frontend's URL.

1.  **Open the backend code:** `functions/index.ts`.
2.  **Update CORS:** Find the line `app.use(cors({ origin: true }));` and replace `true` with your Firebase Hosting URL from Step 2.

    ```ts
    // In functions/index.ts

    // Before:
    app.use(cors({ origin: true }));

    // After (use your actual URL):
    const allowedOrigins = ['https://your-project-id.web.app', 'https://your-project-id.firebaseapp.com'];
    app.use(cors({ origin: allowedOrigins }));
    ```
3.  **Commit and Push:** Save your changes and push them to your main branch on GitHub.
    *   If you followed the **CLI guide**, redeploy the backend by running the same `gcloud run deploy` command from Step 1.
    *   If you followed the **UI guide**, pushing to GitHub will automatically trigger a secure redeployment of your backend service. Your app is now fully secured.

---

## Troubleshooting

-   **Error: `HTTPError 403: The billing account for the owning project is disabled...`**
    -   **Cause:** This is the most common error. Your Google Cloud Project is not linked to an active billing account. Google Cloud services like Cloud Run and Cloud Build are required for deployment and are not free.
    -   **Solution:** You must enable billing for your project.
        1.  Go to the [Google Cloud Billing Console](https://console.cloud.google.com/billing).
        2.  Select your project.
        3.  Link an active billing account or create a new one.
        4.  After enabling billing, retry the deployment. If you get an API error, you may also need to enable the specific APIs listed below.

-   **Error: `APIs have not been used` or `API [run.googleapis.com] is not enabled`**
    -   **Cause:** The backend deployment uses several Google Cloud services that need to be enabled for your project first.
    -   **Solution:** For CLI users, run these commands to enable the required APIs. For UI users, the console will often prompt you to enable them.
        ```bash
        gcloud services enable run.googleapis.com
        gcloud services enable cloudbuild.googleapis.com
        gcloud services enable artifactregistry.googleapis.com
        ```

-   **Error: `Not in a Firebase app directory (could not locate firebase.json)`**
    -   **Cause:** You are running the `firebase` command from the wrong folder.
    -   **Solution:** Use the `cd` command in your terminal to navigate to the project's **root directory** (the one containing `firebase.json` and `index.html`) before running the command again.

-   **Error: `PERMISSION_DENIED`**
    -   **Cause:** The account you're logged in with (`gcloud auth list`) doesn't have sufficient permissions.
    -   **Solution:** In the GCP Console, go to "IAM & Admin" and ensure your account has the `Editor` or `Owner` role for the project.
