create table if not exists site_content (
  id text primary key,
  data text not null,
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table if not exists order_intents (
  id text primary key,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1 check (quantity between 1 and 20),
  customer_name text not null check (length(customer_name) between 1 and 80),
  contact text not null check (length(contact) between 1 and 160),
  notes text check (notes is null or length(notes) <= 800),
  status text not null default 'new' check (status in ('new', 'contacted', 'paid', 'fulfilled', 'cancelled')),
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create index if not exists idx_orders_status_created
on order_intents (status, created_at desc);
