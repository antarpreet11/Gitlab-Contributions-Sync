# GitLab to GitHub Contributions Sync

This Next.js web app automates the synchronization of contributions from GitLab repositories to GitHub. The application allows users to sign into GitHub, enter their GitLab credentials, select GitLab repositories, and sync contributions to a dummy GitHub repository.

## Features

- **GitHub Authentication**: Sign in to GitHub to authorize the synchronization.
- **GitLab Credentials**: Provide GitLab organization domain URL and personal access token for authentication.
- **Repository Selection**: Choose GitLab repositories whose contributions you want to sync.
- **Commit Synchronization**: Mirror commit times and hashes from GitLab to a dummy GitHub repository.
- **Incremental Sync**: Automatically updates the dummy GitHub repository with new commits from GitLab.

## Usage

To use the GitLab to GitHub Contributions Sync web app, follow these steps:

1. **Access the Application**

   Open the web application in your browser. [Here](https://gitlab-sync.vercel.app/)

2. **Sign in to GitHub**

   Click the "Sign in with GitHub" button and authorize the application to access your GitHub account.

3. **Enter GitLab Credentials**

   Provide your GitLab organization domain URL and personal access token to authenticate your GitLab account.

4. **Select GitLab Repositories**

   Choose the GitLab repositories whose contributions you want to sync to GitHub.

5. **Start Synchronization**

   The application will fetch commits from the selected GitLab repositories, create a dummy repository on GitHub, and mirror the commit times and hashes. If a previous sync exists, the app will only sync new commits that haven't been synced yet.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## TODO (Personal Note)

- Fix the Github SignIn State Issue
- Allow Github Personal Access Token instead of App Auth
- Fix Local Storage issue on Prod
- Improve Updates Logging in Data.tsx
- Test more scenarios

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
