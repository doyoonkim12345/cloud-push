# dbClients

Create a table called cursor to manage the versions of bundles.

## NoSQL (lowdb, firebase)

No special configuration is required.

## SQL (supabase)

You need to create a table.

### postgres SQL

```sql
create table public."cursor" (
  "runtimeVersion" text not null,
  "updatePolicy" text,
  "supportIos" boolean,
  "supportAndroid" boolean,
  "gitHash" text,
  environment text,
  "createdAt" bigint,
  "bundleId" text not null,
  channel text,
  constraint "cursor_pkey" primary key ("bundleId")
);

```
