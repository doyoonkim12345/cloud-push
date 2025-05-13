# Database Providers

cursor라는 테이블을 만들어서 번들들의 버전을 관리합니다.

## NoSQL (lowdb, firebase)

특별한 설정이 필요하지 않습니다.

## SQL (supabase)

테이블을 만드셔야 합니다.

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