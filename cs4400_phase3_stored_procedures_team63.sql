-- CS4400: Introduction to Database Systems: Monday, March 3, 2025
-- Simple Airline Management System Course Project Mechanics [TEMPLATE] (v0)
-- Views, Functions & Stored Procedures

/* This is a standard preamble for most of our scripts.  The intent is to establish
a consistent environment for the database behavior. */
set global transaction isolation level serializable;
set global SQL_MODE = 'ANSI,TRADITIONAL';
set names utf8mb4;
set SQL_SAFE_UPDATES = 0;

use flight_tracking;
-- -----------------------------------------------------------------------------
-- stored procedures and views
-- -----------------------------------------------------------------------------
/* Standard Procedure: If one or more of the necessary conditions for a procedure to
be executed is false, then simply have the procedure halt execution without changing
the database state. Do NOT display any error messages, etc. */

-- [_] supporting functions, views and stored procedures
-- -----------------------------------------------------------------------------
/* Helpful library capabilities to simplify the implementation of the required
views and procedures. */
-- -----------------------------------------------------------------------------
drop function if exists leg_time;
delimiter //
create function leg_time (ip_distance integer, ip_speed integer)
	returns time reads sql data
begin
	declare total_time decimal(10,2);
    declare hours, minutes integer default 0;
    set total_time = ip_distance / ip_speed;
    set hours = truncate(total_time, 0);
    set minutes = truncate((total_time - hours) * 60, 0);
    return maketime(hours, minutes, 0);
end //
delimiter ;

-- [1] add_airplane()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airplane. A new airplane must be sponsored
by an existing airline, and must have a unique tail number for that airline.
username. An airplane must also have a non-zero seat capacity and speed. An
airplane might also have other factors depending on it's type, like the model and the
engine.
Finally, an airplane must have a new and database-wide unique location
since it will be used to carry passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airplane;
delimiter //
create procedure add_airplane (in ip_airlineID varchar(50), in ip_tail_num varchar(50),
	in ip_seat_capacity integer, in ip_speed integer, in ip_locationID varchar(50),
    in ip_plane_type varchar(100), in ip_maintenanced boolean, in ip_model varchar(50),
    in ip_neo boolean)
sp_main: begin
	-- Ensure that the airplane and location values are new and unique
	IF (ip_locationID is null or ip_locationID in (select locationID from location)) then
		leave sp_main;
	END IF;
    
    IF (ip_airlineID not in (select airlineID from airline) OR 
    ip_tail_num in (select tail_num from airplane where airlineID = ip_airlineID)) THEN
		leave sp_main;
	end if;
    
    if (ip_seat_capacity <= 0 or ip_speed <= 0) then
		leave sp_main;
	end if;
    
    -- Ensure that the plane type is valid: Boeing, Airbus, or neither
    if (ip_plane_type is not null and ip_plane_type != 'Boeing' and ip_plane_type != 'Airbus') then
		leave sp_main;
	end if;
    
    -- Ensure that the type-specific attributes are accurate for the type
    if ip_plane_type = 'Boeing' and (ip_maintenanced is null or ip_model is null) then
		leave sp_main;
	elseif ip_plane_type = 'Airbus' and (ip_neo is null) then
		leave sp_main;
	end if;

	-- Add airplane and location into respective tables
    insert into location(locationID) values (ip_locationID);
    insert into airplane(airlineID, tail_num, seat_capacity, speed, locationID,
   plane_type, maintenanced, model, neo)
   values (ip_airlineID, ip_tail_num, ip_seat_capacity, ip_speed, ip_locationID,
   ip_plane_type, ip_maintenanced,ip_model, ip_neo);
end //
delimiter ;

-- [2] add_airport()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airport.  A new airport must have a unique
identifier along with a new and database-wide unique location if it will be used
to support airplane takeoffs and landings.  An airport may have a longer, more
descriptive name.  An airport must also have a city, state, and country designation. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airport;
delimiter //
create procedure add_airport (in ip_airportID char(3), in ip_airport_name varchar(200),
    in ip_city varchar(100), in ip_state varchar(100), in ip_country char(3), in ip_locationID varchar(50))
sp_main: begin

	IF (ip_locationID is null) then
		leave sp_main;
	END IF;
	IF (ip_airportID is null) then
		leave sp_main;
	END IF;
	-- Ensure that the airport and location values are new and unique
    -- Add airport and location into respective tables
    if (ip_airportID not in (select airportID from airport)) AND
		(ip_locationID not in (select locationID from location))
    
    then
		insert into location(locationID) values (ip_locationID);
		insert into airport(airportID, airport_name, city, state, country, locationID) values
        (ip_airportID, ip_airport_name, ip_city, ip_state, ip_country, ip_locationID);
    
    end if;

end //
delimiter ;

-- [3] add_person()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new person.  A new person must reference a unique
identifier along with a database-wide unique location used to determine where the
person is currently located: either at an airport, or on an airplane, at any given
time.  A person must have a first name, and might also have a last name.

A person can hold a pilot role or a passenger role (exclusively).  As a pilot,
a person must have a tax identifier to receive pay, and an experience level.  As a
passenger, a person will have some amount of frequent flyer miles, along with a
certain amount of funds needed to purchase tickets for flights. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_person;
delimiter //
create procedure add_person (in ip_personID varchar(50), in ip_first_name varchar(100),
    in ip_last_name varchar(100), in ip_locationID varchar(50), in ip_taxID varchar(50),
    in ip_experience integer, in ip_miles integer, in ip_funds integer)
sp_main: begin

	-- Ensure that the location is valid
    -- Ensure that the persion ID is unique
    -- Ensure that the person is a pilot or passenger
    -- Add them to the person table as well as the table of their respective role
	IF (ip_personID is null) then
		leave sp_main;
	END IF;
    
    IF (ip_first_name is null) then
		leave sp_main;
	END IF;
    IF (ip_locationID is null) then
		leave sp_main;
	END IF;
    if(ip_personID not in (select personID from person)) and
		(ip_locationID in (select locationID from location)) and
        ((ip_miles is not null AND ip_funds is not null) OR (ip_taxID is not null AND ip_experience is not null)) and
        (ip_first_name is not null) then
			insert into person(personID, first_name, last_name, locationID) values
			(ip_personID, ip_first_name, ip_last_name, ip_locationID);
		
        if(ip_miles is not null AND ip_funds is not null)
        then insert into passenger(personID, miles, funds) values
			(ip_personID, ip_miles, ip_funds);
		else
		insert into pilot(personID, taxID, experience, commanding_flight) values
			(ip_personID, ip_taxID, ip_experience, null); 
		end if;
    end if;

end //
delimiter ;

-- [4] grant_or_revoke_pilot_license()
-- -----------------------------------------------------------------------------
/* This stored procedure inverts the status of a pilot license.  If the license
doesn't exist, it must be created; and, if it aready exists, then it must be removed. */
-- -----------------------------------------------------------------------------
drop procedure if exists grant_or_revoke_pilot_license;
delimiter //
create procedure grant_or_revoke_pilot_license (in ip_personID varchar(50), in ip_license varchar(100))
sp_main: begin
	IF (ip_license is null) then
		leave sp_main;
	END IF;
    
	-- Ensure that the person is a valid pilot
    -- If license exists, delete it, otherwise add the license
    if(ip_personID in (select personID from pilot)) -- check if valid pilot
		then if ip_license in (select license from pilot_licenses group by ip_personID)
			then delete from pilot_licenses where personID = ip_personID and license = ip_license;
		else insert into pilot_licenses(personID, license) values
			(ip_personID, ip_license); 
		end if;
	end if;
end //
delimiter ;

-- [5] offer_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new flight.  The flight can be defined before
an airplane has been assigned for support, but it must have a valid route.  And
the airplane, if designated, must not be in use by another flight.  The flight
can be started at any valid location along the route except for the final stop,
and it will begin on the ground.  You must also include when the flight will
takeoff along with its cost. */
-- -----------------------------------------------------------------------------
drop procedure if exists offer_flight;
delimiter //
create procedure offer_flight (in ip_flightID varchar(50), in ip_routeID varchar(50),
    in ip_support_airline varchar(50), in ip_support_tail varchar(50), in ip_progress integer,
    in ip_next_time time, in ip_cost integer)
sp_main: begin

	IF (ip_routeID is null) then
		leave sp_main;
	END IF;
    IF (ip_next_time is null) then
		leave sp_main;
	END IF;
    IF (ip_cost is null) then
		leave sp_main;
	END IF;

IF (
ip_routeID in (select routeID from route) AND
ip_support_airline in (select airlineID from airline) AND
ip_support_tail in (select tail_num from airplane) AND
ip_progress >= 0 AND
ip_progress <= (select max(sequence) from route_path where routeID = ip_routeID) AND
ip_cost >= 0
)

THEN
insert into flight(flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost) 
values (ip_flightID, ip_routeID, ip_support_airline, ip_support_tail, ip_progress, 'on_ground', ip_next_time, ip_cost);

END IF;
		-- Ensure that the airplane exists
    -- Ensure that the route exists
    -- Ensure that the progress is less than the length of the route
    -- Create the flight with the airplane starting in on the ground
end //
delimiter ;

-- [6] flight_landing()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight landing at the next airport
along it's route.  The time for the flight should be moved one hour into the future
to allow for the flight to be checked, refueled, restocked, etc. for the next leg
of travel.  Also, the pilots of the flight should receive increased experience, and
the passengers should have their frequent flyer miles updated. */
-- -----------------------------------------------------------------------------
drop procedure if exists flight_landing;
delimiter //
create procedure flight_landing (in ip_flightID varchar(50))
sp_main: begin

declare flight_distance int;

-- Ensure the flight exists
IF (ip_flightID not in (select flightID from flight)) then 
-- select 'Flight does not exist!';
leave sp_main;
END IF;

-- Ensure that the flight is in the air
IF ((select airplane_status from flight where flightID = ip_flightID) != 'in_flight') then
-- select 'This FlightID is not in flight!';
leave sp_main;
END IF;

-- Increment the pilot's experience by 1
UPDATE pilot 
SET experience = experience + 1
WHERE personID IN (SELECT personID from (SELECT personID FROM pilot WHERE commanding_flight = ip_flightID) as temp);
    
-- Increment the frequent flyer miles of all passengers on the plane
select distance into flight_distance from flight f
join route_path r on f.routeID = r.routeID
join leg l on r.legID = l.legID
where flightID = ip_flightID
and r.sequence = f.progress;

UPDATE passenger
SET miles = miles + flight_distance
WHERE personID IN

(select p.personID from flight f
join airplane a on f.support_tail = a.tail_num
join person p on a.locationID = p.locationID
where f.flightID = ip_flightID);

-- Update the status of the flight and increment the next time to 1 hour later
	-- Hint: use addtime()
update flight
set next_time = addtime(next_time, '1:00:00'), airplane_status = 'on_ground'
where flightID = ip_flightID;

end //
delimiter ;

-- [7] flight_takeoff()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight taking off from its current
airport towards the next airport along it's route.  The time for the next leg of
the flight must be calculated based on the distance and the speed of the airplane.
And we must also ensure that Airbus and general planes have at least one pilot
assigned, while Boeing must have a minimum of two pilots. If the flight cannot take
off because of a pilot shortage, then the flight must be delayed for 30 minutes. */
-- -----------------------------------------------------------------------------

drop procedure if exists flight_takeoff;
delimiter //
	create procedure flight_takeoff (in ip_flightID varchar(50))
	sp_main: begin
	declare flight_distance decimal(10, 2);
	declare flight_speed decimal(10, 2);
	declare flight_time float;
	declare converted_time time;
	-- Ensure that the flight exists
	IF (ip_flightID not in (select flightID from flight)) then
		-- select 'Flight does not exist! (7)';
		leave sp_main;
	END IF;
    
	-- Ensure that the flight is on the ground
	IF ((select airplane_status from flight where flightID = ip_flightID) = 'in_flight') then
		-- select 'This FlightID is not on ground!';
		leave sp_main;
	END IF;
    
	-- Ensure that the flight has another leg to fly
	IF( (select progress from flight where flightID = ip_flightID) = 
		(select max(sequence) from route_path r join flight f on r.routeID = f.routeID 
		group by f.flightID having f.flightID = ip_flightID)) then
		-- select 'This FlightID does not have another leg to fly! (7)';
		leave sp_main;
	END IF;
	-- Ensure that there are enough pilots (1 for Airbus and general, 2 for Boeing)
		-- If there are not enough, move next time to 30 minutes later
	-- Scenario 1: Less than 2 pilots in Boeing Airplane 
	IF ((select count(personID) from pilot where commanding_flight = ip_flightID) < 2 AND (select plane_type from airplane 
		where tail_num = (select support_tail from flight where flightID = ip_flightID)) = 'Boeing') then
		-- select 'Less than 2 pilots in Boeing';
		update flight
		set next_time = ADDTIME(next_time, '00:30:00')
		where flightID = ip_flightID;
		leave sp_main;
	END IF;
	-- Scenario 2: Less than 1 pilot in Airbus or General Airplane
	IF ((select count(personID) from pilot where commanding_flight = ip_flightID) < 1 AND ((select plane_type from airplane 
		where tail_num = (select support_tail from flight where flightID = 'ba_61')) = 'Airbus')) then
		-- select 'Less than 1 pilot in Airbus or General Airplane';
		update flight
		set next_time = ADDTIME(next_time, '00:30:00')
		where flightID = ip_flightID;
		leave sp_main;
	END IF;
	-- Increment the progress and set the status to in flight
	update flight
	set progress = progress + 1, airplane_status = 'in_flight'
	where flightID = ip_flightID;
    
	-- Calculate the flight time using the speed of airplane and distance of leg
	select distance into flight_distance from flight f
	join route_path r on f.routeID = r.routeID
	join leg l on r.legID = l.legID
	where flightID = ip_flightID
	and r.sequence = f.progress; -- Leg Distance
    
	select speed into flight_speed from flight f 
	join airplane a on f.support_tail = a.tail_num 
	where flightID = ip_flightID; -- Airplane Speed
    
	select (flight_distance / flight_speed) into flight_time; -- Hours
	select (flight_time * 3600) into flight_time; -- Convert to seconds
	select SEC_TO_TIME(flight_time) into converted_time; -- Convert to TIME format
	 
	-- select flight_distance, flight_speed, converted_time;
	-- Update the next time using the flight time
	update flight
	set  next_time = addtime(next_time, converted_time)
	where flightID = ip_flightID;
end //
delimiter ;

-- [8] passengers_board()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting on a flight at
its current airport.  The passengers must be at the same airport as the flight,
and the flight must be heading towards that passenger's desired destination.
Also, each passenger must have enough funds to cover the flight.  Finally, there
must be enough seats to accommodate all boarding passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_board;
delimiter //
create procedure passengers_board (in ip_flightID varchar(50))
sp_main: begin 
	declare flight_cost INT;
	declare curr_progress INT;
    declare num_legs INT;
    declare num_passengers_boarding INT;
    declare departing_airport CHAR(3);
    declare arriving_airport CHAR(3);
	-- Ensure the flight exists
    if (ip_flightID not in (select flightID from flight)) then
		leave sp_main;
	end if;
    -- Ensure that the flight is on the ground
    if ((select airplane_status from flight where flightID = ip_flightID) != 'on_ground') then
		leave sp_main;
	end if;
    -- Ensure that the flight has further legs to be flown
    select progress from flight where flightID = ip_flightID into curr_progress;
    select count(*) from route_path where routeID LIKE (select routeID from flight where flightID = ip_flightID) group by routeID into num_legs;
    if (curr_progress >= num_legs) then
		leave sp_main;
	end if;
    -- Determine the number of passengers attempting to board the flight
    select cost from flight where flightID = ip_flightID into flight_cost;
    -- Use the following to check:
		-- The airport the airplane is currently located at
        select departure from leg where legID like (select legID from route_path where routeID like (select routeID from flight where flightID = ip_flightID) and sequence = (curr_progress + 1)) into departing_airport;
        select arrival from leg where legID like (select legID from route_path where routeID like (select routeID from flight where flightID = ip_flightID) and sequence = (curr_progress + 1)) into arriving_airport;
        
        select count(*) from passenger where 
        -- The passengers are located at that airport
        personID in (select personID from person where locationID like (select locationID from airport where airportID like departing_airport)) and
        -- The passenger's immediate next destination matches that of the flight
        personID in (select personID from passenger_vacations where sequence = 1 and airportID like arriving_airport) and
        -- The passenger has enough funds to afford the flight
        funds >= flight_cost
        
        into num_passengers_boarding;
        
	-- Check if there enough seats for all the passengers
    if (num_passengers_boarding > (select seat_capacity from airplane where tail_num = (select support_tail from flight where flightID = ip_flightID))) then
		-- If not, do not add board any passengers
        leave sp_main;
	else
		-- If there are, board them and deduct their funds
		update passenger pa join person pe on pa.personID = pe.personID
        set pa.funds = pa.funds - (select cost from flight where flightID = ip_flightID), 
        pe.locationID = (select locationID from airplane where tail_num like (select support_tail from flight where flightID = ip_flightID))
        where pa.personID in (
			select personID from(
				select personID from passenger where 
				personID in (select personID from person where locationID like (select locationID from airport where airportID like departing_airport)) and
				personID in (select personID from passenger_vacations where sequence = 1 and airportID like arriving_airport) and
				funds >= flight_cost
			) as temp
        );
	end if;
end //
delimiter ;

-- [9] passengers_disembark()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting off of a flight
at its current airport.  The passengers must be on that flight, and the flight must
be located at the destination airport as referenced by the ticket. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_disembark;
delimiter //
create procedure passengers_disembark (in ip_flightID varchar(50))
sp_main: begin
	declare curr_progress INT;
	declare arriving_airport CHAR(3);
    declare plane_location VARCHAR(50);
    declare people_to_update VARCHAR(50);
	-- Ensure the flight exists
    if (ip_flightID not in (select flightID from flight)) then
		leave sp_main;
	end if;
    
    select progress from flight where flightID = ip_flightID into curr_progress;
    select arrival from leg where legID like (select legID from route_path where routeID like (select routeID from flight where flightID = ip_flightID) and sequence = curr_progress) into arriving_airport;
    select a.locationID from flight f join airplane a on f.support_tail = a.tail_num where f.flightID = ip_flightID into plane_location;
    -- Ensure that the flight is on the ground
    if ((select airplane_status from flight where flightID = ip_flightID) != 'on_ground') then
		leave sp_main;
	end if;
    
    drop table if exists temp_people;
    create temporary table temp_people as
    select personID from passenger where 
	-- Passengers must be on the plane supporting the flight
	personID in (select personID from person where locationID like plane_location) and
	-- Passenger has reached their immediate next destionation airport
	personID in (select personID from passenger_vacations where sequence = 1 and airportID like arriving_airport);
    
    delete from passenger_vacations where personID in (select personID from temp_people) and sequence = 1;
    
    -- Move the appropriate passengers to the airport
    update person
    set locationID = (select locationID from airport where airportID = arriving_airport)
    where personID in (select personID from temp_people);
    
    -- Update the vacation plans of the passengers
    update passenger_vacations set sequence = sequence - 1
    where personID in (select personID from temp_people) and sequence >= 2;
end //
delimiter ;

-- [10] assign_pilot()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a pilot as part of the flight crew for a given
flight.  The pilot being assigned must have a license for that type of airplane,
and must be at the same location as the flight.  Also, a pilot can only support
one flight (i.e. one airplane) at a time.  The pilot must be assigned to the flight
and have their location updated for the appropriate airplane. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_pilot;
delimiter //
create procedure assign_pilot (in ip_flightID varchar(50), ip_personID varchar(50))
sp_main: begin
	declare curr_progress INT;
    declare num_legs INT;
    declare curr_type VARCHAR(100);
    declare departing_airport CHAR(3);
    
	-- Ensure the flight exists
    if (ip_flightID not in (select flightID from flight)) then
		leave sp_main;
	end if;
    
    -- Ensure that the flight is on the ground
    if ((select airplane_status from flight where flightID = ip_flightID) != 'on_ground') then
        leave sp_main;
	end if;
    
    -- Ensure that the flight has further legs to be flown
    select progress from flight where flightID = ip_flightID into curr_progress;
    select count(*) from route_path where routeID LIKE (select routeID from flight where flightID = ip_flightID) group by routeID into num_legs;
    if (curr_progress >= num_legs) then
		leave sp_main;
	end if;
    
    -- Ensure that the pilot exists and is not already assigned
    if (ip_personID not in (select personID from pilot where commanding_flight is null)) then
		leave sp_main;
    end if;
    
	-- Ensure that the pilot has the appropriate license
	select plane_type from airplane a join flight f on a.tail_num = f.support_tail where f.flightID = ip_flightID into curr_type;
    if ((curr_type like 'Boeing' or curr_type like 'Airbus') and (curr_type not in (select license from pilot_licenses where personID = ip_personID))) then
        leave sp_main;
	elseif ((curr_type is null) and 'general' not in (select license from pilot_licenses where personID = ip_personID)) then
        leave sp_main;
    end if;
    
    -- Ensure the pilot is located at the airport of the plane that is supporting the flight
    select departure from leg where legID like (select legID from route_path where routeID like (select routeID from flight where flightID = ip_flightID) and sequence = (curr_progress + 1)) into departing_airport;
    if (ip_personID not in (select personID from person p join airport a on p.locationID = a.locationID where a.airportID like departing_airport)) then
        leave sp_main;
	end if;
    
	update person pe join pilot pi on pe.personID = pi.personID
    -- Assign the pilot to the flight
    set pi.commanding_flight = ip_flightID,
    -- and update their location to be on the plane
    pe.locationID = (select locationID from flight f join airplane a on f.support_tail = a.tail_num where f.flightID = ip_flightID)
    where pi.personID = ip_personID;

end //
delimiter ;

-- [11] recycle_crew()
-- -----------------------------------------------------------------------------
/* This stored procedure releases the assignments for a given flight crew.  The
flight must have ended, and all passengers must have disembarked. */
-- -----------------------------------------------------------------------------
drop procedure if exists recycle_crew;
delimiter //
create procedure recycle_crew (in ip_flightID varchar(50))
sp_main: begin
	declare flight_status varchar(100);
	
	declare final_destination varchar(100);
	declare destination_sequence int;
	declare current_progress int;
	
	declare last_location varchar(50);
	declare number_of_passengers_left int;
	
	declare last_leg varchar(50);
	declare last_location_airport varchar(50);
    
	if ip_flightID is not null then
		select f.airplane_status into flight_status from flight as f where f.flightID = ip_flightID;
		
		select rp.sequence into destination_sequence from flight as f, route_path as rp
		where f.flightID = ip_flightID and f.routeID = rp.routeID
		order by rp.sequence desc limit 1;
		select f.progress into current_progress from flight as f
		where f.flightID = ip_flightID;
		 
         if flight_status is not null then
			-- Ensure that the flight is on the ground
			-- Ensure that the flight does not have any more legs
			if flight_status = 'on_ground' and (destination_sequence is null or current_progress is null or destination_sequence = current_progress) then
			
				select a.locationID into last_location from flight as f, airplane as a
				where f.flightID = ip_flightID and f.support_tail = a.tail_num;
				select count(pa.personID) into number_of_passengers_left from person as p left join passenger as pa
				on p.personID = pa.personID where p.locationID = last_location;
				
				select rp.legID into last_leg from flight as f, route_path as rp
				where f.flightID = ip_flightID and f.routeID = rp.routeID
				order by rp.sequence desc limit 1;
				select locationID into last_location_airport from leg as l, airport as a
				where l.legID = last_leg and l.arrival = a.airportID;
				-- Ensure that the flight is empty of passengers
				if number_of_passengers_left = 0 then
				
				-- Update assignements of all pilots
				-- Move all pilots to the airport the plane of the flight is located at
					update person as p, pilot as pi set p.locationID = last_location_airport
					where p.personID = pi.personID
					and pi.commanding_flight = ip_flightID;
					
					update person as p, pilot as pi set pi.commanding_flight = null
					where p.personID = pi.personID
					and pi.commanding_flight = ip_flightID;
				end if;
			end if;
		end if;
	end if;
end //
delimiter ;


-- [12] retire_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a flight that has ended from the system.  The
flight must be on the ground, and either be at the start its route, or at the
end of its route.  And the flight must be empty - no pilots or passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists retire_flight;
delimiter //
create procedure retire_flight (in ip_flightID varchar(50))
sp_main: begin
	declare flight_status varchar(100);
	declare final_destination varchar(100);
	declare destination_sequence int;
	declare current_progress int;
	declare airplane_location varchar(50);
    declare number_of_people_left int;
        
	if ip_flightID is not null then 
		select airplane_status into flight_status from flight as f where f.flightID = ip_flightID;
		select rp.sequence into destination_sequence from flight as f, route_path as rp
		where f.flightID = ip_flightID and f.routeID = rp.routeID order by rp.sequence desc limit 1;
		select f.progress into current_progress from flight as f where f.flightID = ip_flightID;
		
		-- Ensure that the flight is on the ground
		-- Ensure that the flight does not have any more legs
		if flight_status = 'on_ground' and (destination_sequence = current_progress
        or destination_sequence is null
        or current_progress is null
		or current_progress = 0) then
			
			select a.locationID into airplane_location from flight as f, airplane as a
			where ip_flightID = f.flightID and f.support_tail = a.tail_num;
			select count(*) into number_of_people_left from person as p
			where p.locationID = airplane_location;
			
			-- Ensure that there are no more people on the plane supporting the flight
			if number_of_people_left = 0 then
						
				-- Remove the flight from the system
				delete from flight as f where f.flightID = ip_flightID;
					
			end if;
        end if;
    end if;
end //
delimiter ;

-- [13] simulation_cycle()
-- -----------------------------------------------------------------------------
/* This stored procedure executes the next step in the simulation cycle.  The flight
with the smallest next time in chronological order must be identified and selected.
If multiple flights have the same time, then flights that are landing should be
preferred over flights that are taking off.  Similarly, flights with the lowest
identifier in alphabetical order should also be preferred.

If an airplane is in flight and waiting to land, then the flight should be allowed
to land, passengers allowed to disembark, and the time advanced by one hour until
the next takeoff to allow for preparations.

If an airplane is on the ground and waiting to takeoff, then the passengers should
be allowed to board, and the time should be advanced to represent when the airplane
will land at its next location based on the leg distance and airplane speed.

If an airplane is on the ground and has reached the end of its route, then the
flight crew should be recycled to allow rest, and the flight itself should be
retired from the system. */
-- -----------------------------------------------------------------------------
drop procedure if exists simulation_cycle;
delimiter //
create procedure simulation_cycle ()
sp_main: begin
	declare smallest_next_time time;
	declare num_potential_next_flight int;
	declare num_of_landing_flights int;
	declare next_flight_flightID varchar(50);
	declare next_flight_status varchar(100);
	declare destination_sequence int;
	declare current_progress int;
	declare null_people_left int;

	-- Identify the next flight to be processed
    select f.next_time into smallest_next_time from flight as f
    order by f.next_time asc limit 1;
    
    if smallest_next_time is null then
		leave sp_main;
	end if;
    
    select count(*) into num_potential_next_flight from 
    flight as f where f.next_time = smallest_next_time;
    
	if num_potential_next_flight = 1 then
		select f.flightID into next_flight_flightID from 
		flight as f where f.next_time = smallest_next_time;
	else
		select count(*) into num_of_landing_flights from flight as f
		where f.next_time = smallest_next_time and f.airplane_status = 'in_flight';
		if num_of_landing_flights = 0 then
			select f.flightID into next_flight_flightID from flight as f
			where f.next_time = smallest_next_time order by f.flightID asc
			limit 1;
		else
			select f.flightID into next_flight_flightID from flight as f
			where f.next_time = smallest_next_time and f.airplane_status = 'in_flight'
			order by f.flightID asc limit 1;
		end if;
	end if;
    
    select f.airplane_status into next_flight_status from flight as f
    where f.flightID = next_flight_flightID;
    
    select f.progress into current_progress from flight as f
    where f.flightID = next_flight_flightID;
	
    -- If the flight is in the air:
		-- Land the flight and disembark passengers
        -- If it has reached the end:
			-- Recycle crew and retire flight
	if next_flight_status is not null then
		if next_flight_status = 'in_flight' then
			call flight_landing(next_flight_flightID);
			call passengers_disembark(next_flight_flightID);
			
			select rp.sequence into destination_sequence from flight as f, route_path as rp
			where f.flightID = next_flight_flightID and f.routeID = rp.routeID order by rp.sequence desc limit 1;	
			
            if destination_sequence is not null and current_progress is not null then 
				if destination_sequence = current_progress then 
					call recycle_crew(next_flight_flightID);
					call retire_flight(next_flight_flightID);
				end if;
			end if;
		-- If the flight is on the ground:
			-- Board passengers and have the plane takeoff
		elseif next_flight_status = 'on_ground' then
			select rp.sequence into destination_sequence from flight as f, route_path as rp
			where f.flightID = next_flight_flightID and f.routeID = rp.routeID order by rp.sequence desc limit 1;	
			
            if destination_sequence is not null and current_progress is not null then 
				if destination_sequence = current_progress then 
					call recycle_crew(next_flight_flightID);
					call retire_flight(next_flight_flightID);
                    leave sp_main;
				end if;
			end if;
			call passengers_board(next_flight_flightID);
			call flight_takeoff(next_flight_flightID);
		end if;
	end if;
	-- Hint: use the previously created procedures

end //
delimiter ;

-- [14] flights_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where flights that are currently airborne are located. 
We need to display what airports these flights are departing from, what airports 
they are arriving at, the number of flights that are flying between the 
departure and arrival airport, the list of those flights (ordered by their 
flight IDs), the earliest and latest arrival times for the destinations and the 
list of planes (by their respective flight IDs) flying these flights. */
-- -----------------------------------------------------------------------------
create or replace view flights_in_the_air (departing_from, arriving_at, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as
select l.departure as departing_from,
	l.arrival as arriving_at,
    count(f.flightID) as num_flights,
    group_concat(f.flightID order by f.flightID) as flight_list,
    min(f.next_time) as earliest_arrival,
    max(f.next_time) as latest_arrival,
    group_concat(a.locationID order by f.flightID) as airplane_list
    from flight f
    join route_path r ON f.routeID = r.routeID AND f.progress = r.sequence
    join leg l on (r.legID = l.legID)
    join airplane a on (f.support_tail = a.tail_num)
    where f.airplane_status = 'in_flight'
	group by l.departure, l.arrival;

-- [15] flights_on_the_ground()
-- ------------------------------------------------------------------------------
/* This view describes where flights that are currently on the ground are 
located. We need to display what airports these flights are departing from, how 
many flights are departing from each airport, the list of flights departing from 
each airport (ordered by their flight IDs), the earliest and latest arrival time 
amongst all of these flights at each airport, and the list of planes (by their 
respective flight IDs) that are departing from each airport.*/
-- ------------------------------------------------------------------------------
create or replace view flights_on_the_ground (departing_from, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as 
-- select deperating_from, num_flights, flight_list, earliest_arrival, latest_arrival, airplane 
select l.departure as departing_from,
    count(l.departure) as num_flights,
    group_concat(f.flightID order by f.flightID) as flight_list,
    min(f.next_time) as earliest_arrival,
    max(f.next_time) as latest_arrival,
    group_concat(a.locationID order by f.flightID) as airplane_list
    from flight f
    join route_path r ON f.routeID = r.routeID AND (f.progress+1) = (r.sequence)
    join leg l on (r.legID = l.legID)
    join airplane a on (f.support_tail = a.tail_num)
    where f.airplane_status = 'on_ground'
	group by l.departure
union
select l.arrival as departing_from,
    count(l.arrival) as num_flights,
    group_concat(f.flightID order by f.flightID) as flight_list,
    min(f.next_time) as earliest_arrival,
    max(f.next_time) as latest_arrival,
    group_concat(a.locationID order by f.flightID) as airplane_list
    from flight f
    join route_path r ON f.routeID = r.routeID AND (f.progress) = (r.sequence)
    join leg l on (r.legID = l.legID)
    join airplane a on (f.support_tail = a.tail_num)
    where f.airplane_status = 'on_ground' and f.progress = (select max(sequence) from route_path where routeID = f.routeID)
	group by l.arrival;

-- [16] people_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently airborne are located. We 
need to display what airports these people are departing from, what airports 
they are arriving at, the list of planes (by the location id) flying these 
people, the list of flights these people are on (by flight ID), the earliest 
and latest arrival times of these people, the number of these people that are 
pilots, the number of these people that are passengers, the total number of 
people on the airplane, and the list of these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_in_the_air (departing_from, arriving_at, num_airplanes,
	airplane_list, flight_list, earliest_arrival, latest_arrival, num_pilots,
	num_passengers, joint_pilots_passengers, person_list) as
select departure as departing_from, arrival as arriving_at, 
count(distinct a.tail_num) as num_airplanes, 
group_concat(distinct a.locationID) as airplane_list,
group_concat(distinct f.flightID) as flight_list,
min(next_time) as earliest_arrival,
max(next_time) as latest_arrival,
count(taxID) as num_pilots,
count(miles) as num_passengers,
count(pe.personID) as joint_pilots_passengers,
group_concat(pe.personID order by pe.personID) as person_list
from leg l join route_path rp on l.legID = rp.legID
join flight f on rp.routeID = f.routeID and rp.sequence = f.progress
join airplane a on f.support_tail = a.tail_num
join person pe on a.locationID = pe.locationID
left join passenger pa on pe.personID = pa.personID
left join pilot pi on pe.personID = pi.personID
where airplane_status = 'in_flight'
group by departing_from, arriving_at;

-- [17] people_on_the_ground()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently on the ground and in an 
airport are located. We need to display what airports these people are departing 
from by airport id, location id, and airport name, the city and state of these 
airports, the number of these people that are pilots, the number of these people 
that are passengers, the total number people at the airport, and the list of 
these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_on_the_ground (departing_from, airport, airport_name,
	city, state, country, num_pilots, num_passengers, joint_pilots_passengers, person_list) as
select a.airportID as departing_from,
a.locationID as airport,
airport_name,
city,
state,
country,
count(taxID) as num_pilots,
count(miles) as num_passengers,
count(pe.personID) as joint_pilots_passengers,
group_concat(pe.personID order by pe.personID) as person_list
from airport a
join person pe on a.locationID = pe.locationID
left join passenger pa on pe.personID = pa.personID
left join pilot pi on pe.personID = pi.personID
group by departing_from;

-- [18] route_summary()
-- -----------------------------------------------------------------------------
/* This view will give a summary of every route. This will include the routeID, 
the number of legs per route, the legs of the route in sequence, the total 
distance of the route, the number of flights on this route, the flightIDs of 
those flights by flight ID, and the sequence of airports visited by the route. */
-- -----------------------------------------------------------------------------
create or replace view route_summary (route, num_legs, leg_sequence, route_length,
	num_flights, flight_list, airport_sequence) as
  select
      rp.routeID as route,
      count(rp.legID) as num_legs,
      group_concat(rp.legID order by rp.sequence) as leg_sequence,
      sum(l.distance) as route_length,
      IF((select count(f.flightID) from flight f where f.routeID = rp.routeID) IS NULL, 0, (select count(f.flightID) from flight f where f.routeID = rp.routeID)) as num_flights,
      (select group_concat(f.flightID order by f.flightID) from flight f where f.routeID = rp.routeID group by f.routeID) as flight_list,
      (select group_concat(concat(legTemp.departure, '->', legTemp.arrival) order by rpTemp.sequence)
          from route_path rpTemp
          join leg legTemp on rpTemp.legID = legTemp.legID
          where rpTemp.routeID = rp.routeID
      ) as airport_sequence
  from
      route_path as rp
  join
      leg as l on rp.legID = l.legID
  group by
      rp.routeID;

-- [19] alternative_airports()
-- -----------------------------------------------------------------------------
/* This view displays airports that share the same city and state. It should 
specify the city, state, the number of airports shared, and the lists of the 
airport codes and airport names that are shared both by airport ID. */
-- -----------------------------------------------------------------------------
create or replace view alternative_airports (city, state, country, num_airports,
	airport_code_list, airport_name_list) as
select city, state, country, count(airportID) as 'num_airports', 
group_concat(airportID order by airportID) as 'airport_code_list',
group_concat(airport_name order by airportID) as 'airport_code_list'
from airport group by city, state, country having count(airportID) > 1; 
