.mode csv

drop index if exists idx_items;
drop table if exists items;
.import items.csv items
create unique index idx_items on items (ItemKey);

drop index if exists idx_locations;
drop table if exists locations;
.import locations.csv locations
create unique index idx_locations on locations (LocationKey);

drop index if exists idx_itemLocations;
drop table if exists itemLocations;
.import itemLocations.csv itemLocations
create index idx_itemLocations on itemLocations (ItemKey, OrderNumber);

drop index if exists idx_reuseIdeas;
drop table if exists reuseIdeas;
.import reuseIdeas.csv reuseIdeas
create index idx_reuseIdeas on reuseIdeas (ItemKey, OrderNumber);

drop index if exists idx_relatedItems_a;
drop index if exists idx_relatedItems_b;
drop table if exists relatedItems;
.import relatedItems.csv relatedItems
create unique index idx_relatedItems_a on relatedItems (ItemKeyA, ItemKeyB);
create index idx_relatedItems_b on relatedItems (ItemKeyB, ItemKeyA);
