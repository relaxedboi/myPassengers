use passanger;

show tables;

desc bookings;

drop table bookings;

create table bookings
(
pnr varchar(255) primary key,
username varchar(255) references users(username),
t_number varchar(255) references trains(t_number)
); 

drop table berth;

create table Available_seats(
sleeper int not null,
firstAC int not null,
secondAC int not null,
thirdAC int not null,
Seating int not null,
primary key (sleeper,firstAC,secondAC,thirdAC,seating)
);

create table passangers
(
p_id varchar(255) primary key,
pass_name varchar(255) not null,
age int not null,
gender varchar(255) not null,
pnr varchar(255) references bookings(pnr) 
);

desc passangers;

alter table passangers
add column seating varchar(255) references available_seats(seating);

create table users(
username varchar(255) primary key,
passkey varchar(255) not null,
firstname varchar(255) not null,
lastname varchar(255) not null,
email varchar(255) not null,
ph_number varchar(255) not null 
);

desc bookings;

alter table bookings
add column total_fare int8;

select pnr,t_number,start_dest,end_dest,total_fare from bookings where username = 'rohan';

create table trains
(
t_number varchar(255) primary key,
start_station varchar(255) not null,
end_station varchar(255) not null,
train_type varchar(255) not null,
train_time datetime
);

create table stations
(
station_name varchar(255) primary key,
city varchar(255) not null,
pin varchar(255) not null,
t_number varchar(255) references trains(t_number)
);

create table berth
(
berth_number varchar(255) primary key,
bogi_number varchar(255) not null,
t_number varchar(255) references trains(t_number)
);

create table bookings
(
username varchar(255) references users(username),
t_number varchar(255) references trains(t_number),
berth_number varchar(255) references berth(berth_number),
primary key(username,t_number,berth_number)
);

show tables;

select * from users;

desc trains;

alter table trains
add column train_name varchar(255);

use passanger;
select t.t_number,tr.train_name,t.start_time,t.end_time from timings t,trains tr where t.t_number = 1234 and tr.t_number = 1234;

desc trains;

create table timings
(
t_number varchar(255) not null,
start_time datetime,
end_time datetime
);
use passanger;

desc trains;

select * from trains;

select * from stations;

desc available_seats;

alter table available_seats
add column t_number varchar(255) references trains(t_number);

desc passangers;

alter table passangers
add column seat_no varchar(255) not null;

select * from bookings;

insert into bookings values(1234,'Rohan',1234,'kudachi','belganvi',123);

use passanger;

drop table available_seats;

create table available_seat
(
id int primary key auto_increment,
available_seats int8 not null,
fare int8 not null,
t_number varchar(255) references trains(t_number)
);

create table fare
(
t_number varchar(255) references trains(t_number),
sleeper int8 not null,
firstAC int8 not null,
secondAC int8 not null,
thirdAC int8 not null,
seating int8 not null
);

use passanger;

show tables;

select * from trains;

alter table fare
add column date_ date;

desc fare;

select * from fare;

truncate fare;

insert into fare values('1234',200,170,150,125,80,date '1997/12/11');

select * from trains;

desc stations;

insert into stations values('belganvi station','bgm','590300','1234');
use passanger;

desc trains;

select * FROM trains t where 'kudachi' in (select city from stations) and 'bgm' in (select city from stations) and date_ = "1997-11-12";

delete from seat_type where date_ = null;
desc seat_type;
truncate seat_type;
alter table seat_type
add column t_number varchar(255) primary key references trains(t_number);
insert into seat_type values(123,100,80,60,150,"1997-11-12",'1234');
select * from seat_type where t_number = '1234' and  date_ = "1997-11-12";

select b.*,t.train_name from bookings b ,trains t where b.t_number = t.t_number and b.pnr = '1234';
desc fare;
desc bookings;

select * from fare;

use passanger;
update fare 
set date_ = '1997-11-12' where t_number = '1234';

select sleeper from fare where t_number = '1234' and date_ = '1997-11-12';
select * from bookings order by pnr desc limit 1;
use passanger;
desc passangers;

alter table passangers
add column coach varchar(255) not null;
desc fare;
desc bookings;
select * from seat_type;
select * from passangers;
select b.*,t.train_name from bookings b,trains t where b.username = 'Rohan' and b.t_number = t.t_number;
desc passangers;
select * from bookings;
alter table passangers
drop column p_id;
select * from passangers;
select secondAC from seat_type where t_number = '1234';

use passanger;
select sleeper from seat_type where t_number = '1234';
alter table seat_type
add column t_number varchar(255) primary key references trains(t_number); 