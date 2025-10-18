# Deployment Flow

This project uses a trunk-based development strategy with automated deployments to staging and production environments via GitHub Actions and Cloudflare Workers.

## Overview

The deployment process follows three stages:

1. **Local Development**: Feature branches are deployed locally during active development
2. **Staging**: Automatic deployment to staging environment when PRs are merged to master
3. **Production**: Deployment to production environment when master branch is tagged with a release version

## Development Environment

When working on a feature branch locally, deploy and test your changes with:

```bash
npm run dev
```

This starts the local development server powered by Wrangler, allowing you to test your code before pushing to the repository. There are no automated deployments during feature branch development.

## Staging Environment

Staging deployments are triggered automatically when a pull request is merged into the `master` branch.

### How it works

1. Create a feature branch from `master`
2. Push commits and create a pull request
3. Once the PR is approved and merged to `master`, GitHub Actions automatically deploys to staging
4. The staging environment uses its own set of environment variables configured in GitHub Secrets

### Accessing staging

The staging environment URL is available in the GitHub Actions workflow run output. Environment-specific configuration is automatically injected during the deployment process.

## Production Environment

Production deployments are triggered only when a version tag is created and pushed to the `master` branch.

### How it works

1. After validating the staging environment, create a release tag on `master`:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actions automatically detects the tag and deploys to production
3. The production environment uses its own secure set of environment variables configured in GitHub Secrets

### Versioning

Use semantic versioning for release tags (e.g., `v1.0.0`, `v1.1.0`, `v2.0.0`). Only tagged commits on the `master` branch trigger production deployments.

## Environment Variables

Each environment (staging and production) has its own configuration:

- **Staging secrets**: Configure `STAGING_*` secrets in GitHub repository settings
- **Production secrets**: Configure `PRODUCTION_*` secrets in GitHub repository settings

The deployment workflow uses these secrets to inject the correct environment variables into each deployment. Refer to your `wrangler.jsonc` configuration for how environment-specific variables are passed to Cloudflare Workers.

## GitHub Actions Workflow

The automated deployment is handled by a GitHub Actions workflow that:

1. Triggers on merge to `master` (staging deployment)
2. Triggers on new version tags on `master` (production deployment)
3. Installs dependencies
4. Authenticates with Cloudflare
5. Deploys to the appropriate environment with correct environment variables

### Workflow triggers

- **Staging**: `push` to `master` branch
- **Production**: `push` of tags matching `v*` pattern on `master` branch

## Troubleshooting

**Deployment failed**: Check the GitHub Actions workflow run logs for error messages. Common issues include missing secrets or authentication failures.

**Environment variables not loading**: Verify that the correct secrets are configured in GitHub repository settings and match the expected variable names in your workflow.

**Staging deployed but production didn't**: Production only deploys on version tags. Ensure you've created and pushed a tag (e.g., `git tag v1.0.0 && git push origin v1.0.0`).

## Summary

| Stage | Trigger | Command | Environment |
|-------|---------|---------|-------------|
| Local | Manual | `npm run dev` | Local machine |
| Staging | PR merge to master | GitHub Actions | Cloudflare Workers (staging) |
| Production | Version tag on master | GitHub Actions | Cloudflare Workers (production) |
