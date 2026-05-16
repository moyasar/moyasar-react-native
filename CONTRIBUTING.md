# Contributing

Contributions are welcome, no matter how large or small.

This guide is intended to get a new contributor from a clean machine to a running project and a PR-ready change.

## Repository layout

This project is a monorepo managed with [Yarn workspaces](https://yarnpkg.com/features/workspaces).

- Root package: the React Native library.
- `example/`: demo app that consumes the local library.

`example` is wired to the local source, so library changes are reflected there.

## Platform support

- iOS development requires macOS (Xcode).
- Android development works on macOS, Linux, and Windows.
- Full end-to-end local development for both platforms requires macOS.

## Required tools

Install the following before you start:

1. Git (latest stable).
2. Node.js `v20.19.0` (see `.nvmrc`).
3. Yarn `3.6.1` (see `packageManager` and `.yarnrc.yml`).
4. Java JDK `17` for Android builds.
5. Android Studio + Android SDK tools (for Android work).
6. Ruby `>= 2.6.10` and Bundler (for iOS pod setup).
7. CocoaPods matching `example/Gemfile` constraints.
8. Xcode (for iOS work).

Android project values used by this repo:

- `compileSdkVersion = 35`
- `targetSdkVersion = 35` in `example`
- `minSdkVersion = 24`
- `buildToolsVersion = 35.0.0`
- `ndkVersion = 27.1.12297006`

### Verify toolchain

Run these once after installation:

```sh
node -v
yarn -v
java -version
ruby -v
bundle -v
```

For CocoaPods (after Bundler is installed):

```sh
cd example
bundle exec pod --version
cd ..
```

> Do not use npm for this repository. It depends on Yarn workspaces.

## First-time setup

1. Clone the repository and move into it.
2. Ensure Node.js `v20.19.0` is active.
3. Install JavaScript dependencies from the repo root.

```sh
yarn install
```

### iOS setup (macOS only)

Install Ruby gems and pods from `example`:

```sh
cd example
bundle install
bundle exec pod install --project-directory=ios
cd ..
```

Notes:

- `example/react-native.config.js` enables automatic pods installation for some flows, but `bundle exec pod install --project-directory=ios` is still the reliable manual step for first-time setup and pod changes.
- Open the workspace file (not the project file) when using Xcode:
  - `example/ios/MoyasarSdkExample.xcworkspace`

### Android setup

Install Android SDK components required by the project:

1. Android SDK Platform 35
2. Android SDK Build-Tools 35.0.0
3. Android NDK 27.1.12297006

Set your SDK path for Gradle if needed:

- File: `example/android/local.properties`
- Example value:

```properties
sdk.dir=/Users/<your-user>/Library/Android/sdk
```

Also ensure `JAVA_HOME` points to JDK 17.

## Run the project

Run commands from the repository root.

1. Start Metro in terminal 1:

```sh
yarn example start
```

2. Start one platform in terminal 2:

Android:

```sh
yarn example android
```

iOS:

```sh
yarn example ios
```

### Build-only commands

Use these when you want explicit platform build commands:

```sh
yarn example build:android
yarn example build:ios
```

### Verify New Architecture is active

In Metro logs, confirm a line similar to:

```text
Running "MoyasarSdkExample" with {"fabric":true,"initialProps":{"concurrentRoot":true},"rootTag":1}
```

`"fabric":true` and `"concurrentRoot":true` indicate New Architecture is running.

## Development workflow

- JavaScript and TypeScript changes usually reflect via Fast Refresh.
- Native Android/iOS changes require rebuilding the app.
- The example app is the primary place to validate your local library changes.

Native IDE entry points:

- Android Studio: open `example/android`.
- Xcode: open `example/ios/MoyasarSdkExample.xcworkspace`.

## Quality checks before opening a PR

Run all checks from the repository root:

```sh
yarn lint
yarn typecheck
yarn test
yarn prepare
```

To auto-fix lint formatting where possible:

```sh
yarn lint --fix
```

## Commit message convention

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en).

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module.
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Commit hooks are configured through `lefthook.yml`.

## Troubleshooting

### `pod install` / iOS dependency issues

Symptom:

- Xcode build fails with sandbox or pods manifest mismatch.

Fix:

```sh
cd example
bundle install
bundle exec pod install --project-directory=ios
cd ..
```

If you use a custom Node installation manager and Xcode cannot find Node:

- Update `example/ios/.xcode.env.local` so `NODE_BINARY` points to your current `node` binary.

### Android SDK path errors

Symptom:

- Gradle cannot find Android SDK.

Fix:

- Ensure `example/android/local.properties` exists and `sdk.dir` points to your SDK.
- Ensure required SDK/NDK versions are installed.

### Java errors (`JAVA_HOME` invalid or missing)

Symptom:

- Gradle reports no Java runtime or invalid `JAVA_HOME`.

Fix:

- Install JDK 17.
- Set `JAVA_HOME` to that installation.
- Re-open your terminal and retry.

### Clean re-install when local environment drifts

```sh
rm -rf node_modules example/node_modules
yarn install
cd example
bundle install
bundle exec pod install --project-directory=ios
cd ..
```

## Sending a pull request

Before opening your PR:

1. Keep PRs focused on one logical change.
2. Ensure lint, typecheck, tests, and build preparation pass.
3. Update docs/tests when behavior changes.
4. Use Conventional Commits.
5. If changing public API or major behavior, open an issue or discuss with maintainers first.

## Publishing to npm (maintainers)

This repository uses [release-it](https://github.com/release-it/release-it):

```sh
yarn release
```

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn`: setup project by installing dependencies.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.
