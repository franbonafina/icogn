# Firebase setup

This project is already wired for:

- Firebase Hosting
- Cloud Firestore

The local config files are:

- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`

## 1. Login to Firebase

```bash
firebase login
```

## 2. Link this repo to a Firebase project

Replace `YOUR_PROJECT_ID` with the real Firebase project id.

```bash
firebase use --add YOUR_PROJECT_ID
```

If you prefer to set it directly in the repo config:

```bash
firebase use YOUR_PROJECT_ID
```

Then update `.firebaserc` so the default alias points to the real project.

## 3. Create the default Firestore database

Official Firebase CLI supports creating the database directly:

```bash
firebase firestore:databases:create "(default)" --location=us-central1
```

Optional hardening flags:

```bash
firebase firestore:databases:create "(default)" --location=us-central1 --delete-protection=ENABLED --point-in-time-recovery=DISABLED
```

Before choosing the region, you can inspect valid Firestore locations:

```bash
firebase firestore:locations
```

You can confirm the database exists with:

```bash
firebase firestore:databases:list
firebase firestore:databases:get "(default)"
```

## 4. Install dependencies

Root app:

```bash
npm install
```

## 5. Deploy Firestore rules and indexes

```bash
firebase deploy --only firestore
```

## 6. Deploy hosting

```bash
firebase deploy --only hosting
```

## 7. Deploy everything for the Firebase Spark-compatible setup

```bash
firebase deploy --only firestore,hosting
```

## Project scripts

The repo also includes helper scripts:

```bash
npm run firebase:build
npm run firebase:deploy:firestore
npm run firebase:deploy:hosting
npm run firebase:deploy:all
npm run firebase:deploy
```

## Recommended first-time deploy order

```bash
firebase login
firebase use --add YOUR_PROJECT_ID
firebase firestore:databases:create "(default)" --location=us-central1
firebase deploy --only firestore
firebase deploy --only hosting
```
