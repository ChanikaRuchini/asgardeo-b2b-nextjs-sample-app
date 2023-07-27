This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# WSO2 B2B Organization Samples

## ⚠️ Read this first

1. The root of the sample-is repository will be referred to as `<SAMPLE_IS_HOME>` throughout this document.
2. Required versions

```
Node version >= v16.16.0
```

```
NPM version >= 8.11.0
```

## 1. Setting up

### Step 1: Create an organization

Create a sub-organization.
name : Best Car Mart

### Step 2: Create application

Now we need **two** applications to communicate with the **Guardio-Business-App** and the \***\*Guardio-Admin-App\*\***.

- Click **Applications** in the left navigation menu.
- Select Standard-Based Application.
- Fill the details and click register.
  - name : **Guardio-App**
  - click management application.
  - Click **Share Application** button, select the suborganizations with which you want to share the application, and proceed.
  - Select **Share with all sub-organizations**, if you want to share your application with all existing suborganizations and every sub-organization that will be created later.
- Go to Protocol section and add the following.

> | Property                 |                                      Value/s                                      |
> | ------------------------ | :-------------------------------------------------------------------------------: |
> | Allowed Grant types      |                           `Organization Switch`, `Code`                           |
> | Authorized redirect URLs | `http://localhost:3001/api/auth/callback/wso2isAdmin` and `http://localhost:3001` |
> | Allowed origin           |                              `http://localhost:3001`                              |

- On the User Attributes tab, click on + Add User Attributes.
  Select `Email`, `First Name`, `Last Name`, and `Username` from the list of attributes. |

### Step 3: Create a user and assign roles

You need to create new users on the sub-organizations with the required permissions.

To create a user for Best Auto Mart with all administrative permissions :

- Use the Organization Switcher to change the organization to Best Auto Mart.
- Create a user named Alex on the Best Auto Mart organization.
- Create an admin role with all permissions.
- Assign Alex to this newly created Role.

create another user named Tom on the Best Auto Mart organization( without assiging roles)

### Step 4: Setup the `.env` file

Update the values in the .env file based on your requirements.

```
# The endpoint of the server's API that the client application will communicate with
# E.g., http://localhost:5000/posts
NEXT_PUBLIC_HOSTED_URL="http://localhost:3000"

# The base URL for the Asgardeo root organization's API
# E.g., https://api.asgardeo.io/t/your-org
NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL="https://api.asgardeo.io/t/guardioinc"

# The client ID for the Asgardeo Shared Application
SHARED_APP_CLIENT_ID="<CLIENT ID OF THE CREATED APP>"

# The client Secret for the Asgardeo Shared Application
SHARED_APP_CLIENT_SECRET=<CLIENT SECRET OF CREATED APP>

# The name of the Asgardeo Shared Application
SHARED_APPICATION_NAME="Guardio-Admin-App"

# The app id of the Asgardeo Shared Application
SHARED_APP_ID="< ID OF THE CREATED APP>"

# Scopes
API_SCOPES="openid email profile internal_login internal_user_mgt_view internal_user_mgt_list internal_user_mgt_update internal_user_mgt_delete internal_user_mgt_create internal_idp_view internal_idp_create internal_idp_update internal_idp_delete internal_application_mgt_view internal_application_mgt_update internal_application_mgt_create internal_application_mgt_delete internal_organization_view internal_role_mgt_view internal_role_mgt_create internal_role_mgt_update internal_role_mgt_delete internal_group_mgt_update internal_group_mgt_view internal_group_mgt_create internal_group_mgt_delete internal_governance_view internal_governance_update"

```

### Step 5: Run the Guardio-App

- Open a separate terminal and run,

```bash
 # From `<SAMPE_IS_HOME>/b2b-sample`
 npm run dev
 # or
 yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Login from the created user `Alex` to the application.
  - Type `Best Car Mart` when pop up to type the organization.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
