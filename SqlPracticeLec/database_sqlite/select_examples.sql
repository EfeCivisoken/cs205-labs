
select *
from   movies
where  cost < 100
order  by title
;

select title, cost
from   movies
where  cost < 100
and    cost > 10
order  by title
;

select title, cost
from   movies
where  cost < 100
and    cost > 10
order  by dec cost
;
select title, cost, year
from   movies
where  cost < 100
and    cost > 10
order  by cost
;
select title, year, cost
from   movies
where  cost < 100
and    cost > 10
order  by year, cost
;

select *
from   movies
where  title LIKE "%Star Wars%"
order  by title
;

select id, title 
from   movies
where  id IN ( 0, 1, 2 )
order  by title
;
select count(*) 
from   movies
where  id IN ( 0, 1, 2 )
order  by title
;


select count(title), avg(cost), max(cost), min(cost)
from   movies
where  cost < 100
and    cost > 10
order  by title
;

select * 
from   movies
INNER JOIN studios ON movies.studioId = studios.id;

select * 
from   movies
LEFT JOIN studios ON movies.studioId = studios.id;

select id, title 
from   movies
where  id IN ( select movieId from starIn where starId = 0 )
order  by title
;

select id, title 
from   movies
where  id IN ( select movieId from starIn where starId =
                      (select id 
                       from   stars 
                       where  name  like "%Fisher%")
              )
order  by title
;