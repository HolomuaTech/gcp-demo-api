## Overview
This is part of the demonstration of building a hello world application on Google Cloud Run using Holomua Tech's Google Cloud Infrastructure as Code and portable CI/CD tooling.  This repository is the backend API for the application.

## Belay Build Grouping

Cloud Build runs Portage before the image is pushed and deployed to Cloud Run. It passes all three build-grouping values to Portage as an all-or-none contract. A build group is scoped to one Belay-managed repository:

- `PORTAGE_BUILD_GROUP_ID` identifies one complete Cloud Build invocation and maps to `gcp:$PROJECT_ID:$BUILD_ID`.
- `PORTAGE_IMAGE_NAME` identifies the image built by the current Portage invocation. It must be the complete Artifact Registry path without a mutable tag such as `:latest`.
- `PORTAGE_BUILD_IMAGE_NAMES` is the comma-delimited list of every tagless image name expected in the build group.

This repository builds one image, so the two image-name values will be identical. If one Cloud Build invocation builds multiple images, every Portage step must receive the same group ID and complete image list while receiving its own image name. A retry that starts a new Cloud Build invocation receives a new `BUILD_ID` and creates a new build group.

Separate Cloud Build invocations do not share a `BUILD_ID`. When separate builds submit images for the same Belay-managed repository, their orchestrator must generate one shared identifier, pass it to each build as a custom substitution such as `_PORTAGE_BUILD_GROUP_ID`, and pass the same complete image list to every Portage invocation. `gcp-demo-api` and `gcp-demo-ui` are separate managed repositories, so they remain separate singleton build groups and cannot be joined with a shared ID today.
Trigger prod build Mon Feb 24 11:50:06 HST 2025
Trigger prod build Mon Feb 24 12:45:25 HST 2025

Trigger prod build Mon Feb 24 19:15:22 HST 2025
## Build Status
Last Updated: Tue Feb 25 13:51:19 HST 2025
Last Updated: Tue Feb 25 14:39:37 HST 2025 - Testing prod pipeline
