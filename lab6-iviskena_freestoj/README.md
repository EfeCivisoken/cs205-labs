[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PsfrB4x3)

# Lab 6

## Checklist

- [ ] Create db
- [x] Outline the README file
- [x] Finish reportModel
- [x] playerModel
- [ ] gamePlayModel
- [ ] gameDefinitionModel
- [ ] Interface
- [ ] Add example usage to README

## Organization

- `reset_db.sh` creates the database and populates it with some sample data.

- Database models are stored in the `models/` subdirectory
- SQL code for creating/populating/destructing the database are stored in `sql/`
- Basic database connections are managed by `database.js`
- `index.js` contains the main code, including the user interface.

## Distribution of Work

### Efe's Tasks

- Create tables
- other models
- Finish ui

### Joseph's Tasks

- Create sample data
- playerModel
- reportModel
- start user interface

## Example Usage

```
$ node index.js 
PRAGMA foreign_keys = ON
Connected to the SQLite database.
PRAGMA foreign_keys = ON
Connected to the SQLite database.
Games Database Explorer
By Efe & Joseph
=======================

>> help
help          - displays this help text
quit          - exits
report        - Generates a report
ureport       - Generates a user-specific report

>> report
select count(game_play_id) as num from GamePlays;
# Games Played:    3
select count(distinct player_id) as num from GamePlays;
# Players:         2
select avg(numGames) as num from (select count(game_play_id) as numGames from GamePlays group by player_id);
Avg. Games/Player: 1.5
select max(score) as num from GamePlays;
Top Game Score:    31650
select avg(score) as num from GamePlays;
Avg Game Score:    12113.333333333334
>>  
>> 
>> ureport
Username? Peter
SELECT player_id, username, email, created_at FROM players WHERE username='Peter'
{
  player_id: 1,
  username: 'Peter',
  email: 'peter@gmail.com',
  created_at: '2025-03-10 17:16:58'
}
select avg(score) as num from GamePlays where player_id=1.0;
2345
>> 
>> 
>> quit
```