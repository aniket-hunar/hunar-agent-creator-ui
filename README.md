# Hunar AI Agent Creator

This project provides a simple UI to create and configure Sales Qualification Agents for the Hunar AI Voice API. It features a secure backend built to run on Google Cloud Run to protect your API key.

## Architecture

This application follows a secure, modern web architecture:

1.  **Frontend**: A React application that provides the user interface for configuring an agent. It does **not** handle any secret API keys.
2.  **Backend**: A Node.js/Express application (located in the `/functions` directory) that runs as a serverless container on Google Cloud Run. It acts as a secure proxy: it receives data from the frontend, adds the secret Hunar AI API key from its environment variables, and forwards the request to the Hunar AI API.

This separation ensures that your secret API key is never exposed to the user's browser.

## How to Deploy

You can deploy the backend service using either the command line (recommended for speed) or the Google Cloud Console UI.

---

### Option 1: Deploy via Command Line (Recommended)

Follow these steps for the quickest deployment.

#### Prerequisites

1.  A Google Cloud Platform (GCP) project with **billing enabled**. ([How to enable billing](https://cloud.google.com/billing/docs/how-to/enable-billing)).
2.  The [Google Cloud SDK (`gcloud` command-line tool)](https://cloud.google.com/sdk/docs/install) installed and authenticated (`gcloud auth login`).
3.  A GCP project selected (`gcloud config set project YOUR_PROJECT_ID`).
4.  Your Hunar AI API Key.

#### Step 1: Deploy the Backend to Cloud Run

The backend code is in the `functions/` directory. The following command will package your local code, build it into a container, and deploy it as a secure service.

1.  **Open your terminal** in the **root directory of this project**.

2.  **Run the deploy command:**
    - Replace `[YOUR_REGION]` with your preferred GCP region (e.g., `us-central1`).
    - Replace `[YOUR_HUNAR_AI_KEY]` with your actual Hunar AI API key.

    ```bash
    gcloud run deploy hunar-agent-creator-service \
      --source functions/ \
      --platform managed \
      --region [YOUR_REGION] \
      --allow-unauthenticated \
      --set-env-vars HUNAR_API_KEY="[YOUR_HUNAR_AI_KEY]"
    ```
    - `--source functions/`: Tells gcloud to use the code inside the local `functions` directory.
    - `--allow-unauthenticated`: Allows your frontend to call this service.
    - `--set-env-vars`: **This is crucial for security.** It stores your API key as a secret environment variable that only the backend service can access.

3.  **Get Your Service URL:**
    After deployment succeeds, the `gcloud` tool will output the **Service URL**. It will look like `https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app`. **Copy this URL.**

#### Step 2: Configure the Frontend

Proceed to the **"Final Step: Configure the Frontend"** section below.

---

### Option 2: Deploy via Google Cloud Console UI

This method involves connecting a source code repository (like GitHub) to Cloud Run.

#### Prerequisites

1.  A Google Cloud Platform (GCP) project with **billing enabled**.
2.  Your Hunar AI API Key.
3.  The project code pushed to a Git repository (e.g., GitHub, GitLab, Bitbucket).

#### Step 1: Start the Cloud Run Deployment

1.  Navigate to [Cloud Run](https://console.cloud.google.com/run) in the Google Cloud Console.
2.  Click **"Create Service"**.

#### Step 2: Configure the Source

1.  Select **"Continuously deploy new revisions from a source repository"**.
2.  Click **"Set up with Cloud Build"**. This will open a new panel.
3.  **Connect your repository:**
    - Choose your provider (e.g., GitHub).
    - Authenticate and select the repository containing this project's code.
    - Agree to the terms and click **"Connect"**.
4.  **Select the branch** you want to deploy (e.g., `main`).
5.  **Build Settings:**
    - Under "Build Type", select **"Google Cloud Buildpacks"**.
    - In the "Source location" field, enter `functions/` to specify that only the code in the `functions` directory should be built.
6.  Click **"Save"**.

#### Step 3: Configure Service Settings

1.  **Service name:** Give your service a name, for example, `hunar-agent-creator-service`.
2.  **Region:** Choose the region where you want to deploy your service.
3.  **Authentication:** Select **"Allow unauthenticated invocations"** to permit your frontend to send requests to this backend.

#### Step 4: Add the Secret API Key

1.  Expand the **"Container(s), volumes, networking, security"** section.
2.  Go to the **"Variables & Secrets"** tab.
3.  Under "Environment variables", click **"Add Variable"**.
4.  Enter the following:
    - **Name:** `HUNAR_API_KEY`
    - **Value:** `[YOUR_HUNAR_AI_KEY]` (paste your actual Hunar AI key here).
    This securely stores your key so it's never exposed to the public.

#### Step 5: Create and Deploy

1.  Click the **"Create"** button at the bottom of the page.
2.  Google Cloud will now start building and deploying your service. This may take a few minutes. You can monitor the progress in the Cloud Build history.
3.  Once deployment is complete, you will be taken to the service's dashboard. **Copy the URL** at the top of the page.

---

## Final Step: Configure the Frontend

Now that your backend is deployed, you just need to tell the frontend where to send its requests.

1.  **Open the frontend code:**
    Open the file `components/AgentForm.tsx`.

2.  **Update the API URL:**
    Find the line with the `backendApiUrl` constant and replace the placeholder with the Service URL you copied from your Cloud Run deployment.

    ```tsx
    // Before
    const backendApiUrl = 'https://YOUR_CLOUD_FUNCTION_URL_HERE';

    // After (example)
    const backendApiUrl = 'https://hunar-agent-creator-service-xxxxxxxxxx-uc.a.run.app';
    ```

3.  **Save the file.** The application is now fully configured and ready to use!

## Troubleshooting Deployment Errors

#### "Billing account... is disabled" error (even when billing is enabled)

This confusing error is usually caused by required APIs not being enabled for your project. The deployment process uses other Google Cloud services like Cloud Build and Artifact Registry behind the scenes.

**How to Fix:**

1.  **Enable Required APIs (Most Common Fix):** Run the following commands in your terminal to ensure the necessary services are enabled. After running them, try the deployment command again.
    ```bash
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    ```
2.  **Check Permissions:** Ensure the account you are logged in with has the `Editor` and `Billing Account User` roles for the project in the GCP Console under "IAM & Admin".
3.  **Check Billing Account Health:** Go to the [Billing section](https://console.cloud.google.com/billing) in the Google Cloud Console and make sure your linked billing account has no alerts and a valid payment method.