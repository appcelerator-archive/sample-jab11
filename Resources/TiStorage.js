/**
 * TiStorage
 *
 * @author      Rick Blalock
 * @company		Appcelerator
 * @version		0.1 - 'Zergling'
 * @license		Apache License 2.0 (see license.txt)
 *
 * A lightweight document storage library.
 * Use this library to quickly build data sets inside the
 * Titanium Properties API.  This is perfect if you don't need to
 * use a SQL database but need to store data.
 *
 * Loosly inspired by:
 * Customer tickets, Lawnchair, MongoDB, and
 * http://developer.appcelerator.com/blog/2010/06/how-to-persist-complex-javascript-objects.html

	NOTES
	There is a lot of functionality that needs to be implemented.  Feel free to contribute!
	Some things that need to be implemented:
	- Remove all records according to criteria
	- Error reporting and better console logging
	- Option to store data in the filesystem?
	- Option to store entire object in one SQL table?
	- Remove a property from a specific row (currently gets set to 'null')
	- Better find() filtering.  i.e. .find({ 'location': 'Florida'}, { 'last_name': 'Blalock'}
		means: Find all records of "Blalock" where location == Florida.
	- Limit method to only get a certain amount of rows
	- sort() method to sort asc, desc, etc.
	- skip() method (used with limit) to skip records to start at a specific index


 	SAMPLE USAGE

	Select a 'database'.  If one is not present in the PropertiesDB, it will be created
	-------------------------------------------------------------------------------
	var conn = TiStorage();
	var db = conn.use('appc');


	Will select an object collection called 'users'.  If it doesn't exist
	it will be created automatically.
	-------------------------------------------------------------------------------
	var users = db.collection('users');


	Another option is to select the database and collection at the same time:
	-------------------------------------------------------------------------------
	var users = conn.use('appc').collection('users);


	Get all records in the users object
	-------------------------------------------------------------------------------
	var allUsers = users.find();


	Creates a new record in the selected collection
	-------------------------------------------------------------------------------
	users.create({
		'first_name': 'Rick',
		'last_name': 'Blalock'
	});


	Filters a record set with the name 'Rick'
	-------------------------------------------------------------------------------
	var getUser = users.find({'first_name': 'Rick'});


	Updates specific record with passed data object
	-------------------------------------------------------------------------------
	users.update(getUser.id, {
		'sport': 'Soccer'
	});


	Updates all records that match the object criteria
	-------------------------------------------------------------------------------
	users.update({ 'last_name': 'Blalock' }, {
		'location': 'Florida'
	});


	Removes record
	-------------------------------------------------------------------------------
	users.remove(getUser.id);


	Check if an object exists
	-------------------------------------------------------------------------------
	users.exists({ 'last_name': 'Smith' }); // returns bool


	Remove ALL records in a collection
	-------------------------------------------------------------------------------
	users.clear();

 */
function TiStorage() {
	// A default name the Ti Properties API will use (most likely will never need to change)
	this.globalStore = 'StorageDb';
	// Global Ti property exposed
	this.storage = JSON.parse(Ti.App.Properties.getString(this.globalStore));

	// If there's no globalStore property yet, make one
	if(this.storage == null) {
		// Start the empty global object and save it to Ti properties
		var StorageDb = {};
		var storage = Ti.App.Properties.setString(this.globalStore, JSON.stringify(StorageDb));

		this.storage = JSON.parse(Ti.App.Properties.getString(this.globalStore));

		Ti.API.info('TiStorage - Ti Prop Created: ' + this.storage);
	}

	/**
	 * Selects the database for this instance.  If
	 * it doesn't exist, creates a new one and then selects
	 *
	 * @param (string) db Name of the database to select / create
	 */
	this.use = function(db) {
		// Create the database if it doesn't exist
		if(this.storage[db] == null) {
			this.storage[db] = {};
			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
		}

		Ti.API.info('TiStorage - Database Selected: ' + db);

		// Create a new instance of the TiStorage factory
		return new TiStorageFactory(this.globalStore, this.storage, db);
	};

	/**
	 * TiStorageFactory for separation of the database / collections
	 *
	 * @param (string) globalStore - The actual name of the stringified Ti Property object
	 * @param (object) storage - The assigned Ti Property
	 * @param (string) db - The name of the database
	 */
	var TiStorageFactory = function(globalStore, storage, db) {
		this.globalStore 	= globalStore;
		this.storage 		= storage;
		this.database 		= db;
		this.colls			= this.storage[this.database];
		this.coll 			= null;

		/**
		 * Selects the collection from the db instance.  If
		 * it doesn't exist, creates a new one and then selects
		 *
		 * @param (string) collection Name of the collection to select / create
		 */
		this.collection = function(collection) {
			if(this.storage[this.database][collection] == null) {
				this.storage[this.database][collection] = [];
				Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
			}

			this.coll = collection;

			Ti.API.info('TiStorage - Collection Selected: ' + this.coll);

			return new TiStorage.core(this.globalStore, this.storage, this.database, this.coll);
		};

		// Return this instance so it can be chained (i.e. select the DB and collection all at once)
		return this;
	};

	/**
	 * TiStorage.core The main actions to be used against the collection
	 *
	 * @param (string) globalStore - The actual name of the stringified Ti Property object
	 * @param (object) storage - The assigned Ti Property
	 * @param (string) database - The name of the database
	 * @param (string) collection - The name of the collection used for this instance
	 */
	TiStorage.core = function(globalStore, storage, database, collection) {
		this.globalStore 	= globalStore;
		this.storage 		= storage;
		this.database 		= database;
		this.collection 	= collection;

		/**
		 * Create a new record / data in the selected collection
		 *
		 * @param (object) obj An object of props/values for the new record
		 */
		this.create = function(obj) {
			// Get the last index and the id prop.
			var coll = this.storage[this.database][this.collection];
			last = coll[coll.length - 1];

			// Create a new id (not perfect)
			obj.id = last ? last.id + 1 : 0;

			this.storage[this.database][this.collection].push(obj);
			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));

			Ti.API.info('TiStorage - Record Created: ' + obj.id);

			return this;
		};

		/**
		 * Updates an existing row / data in the selected collection
		 *
		 * @param (integer) target The item ID property or object to select
		 * @param (object) obj An object of props/values to update
		 */
		this.update = function(target, obj) {
			var record = this.storage[this.database][this.collection],
				row,
				rows,
				prop;

			// @TODO Create a method 'merge' or something similar so we don't have to keep
			// repeating  for in loops for merging or creating props.  Propbably better
			// to use the new JS protocol Object.keys() too, so might want to migrate over

			// If target arg is an object criteria, find all matching records
			if(typeof target == 'object') {
				// Find all results that meet the target object criteria
				rows = this.find(target);

				// Loop through the results and make the appropriate updates
				for(var i = 0; i < rows.length; i++) {
					for(prop in obj) {
						// If prop doesn't exist, create it (prop as string in MongoDB fashion)
						// @TODO Create a way to remove a property if needed on update
						if(rows[i][prop] === undefined) {
							rows[i]['\'' + prop + '\''] = obj[prop];
						} else {
							rows[i][prop] = obj[prop];
						}
					}
				}

			// If target arg is an integer (item id), select just the one record
			} else if(typeof target == 'number') {
				// Get the row to update by ID reference
				row = this.findOne({ id: target });

				for(prop in obj) {
					// If prop doesn't exist, create it (prop as string in MongoDB fashion)
					// @TODO Create a way to remove a property if needed on update
					if(row[prop] === undefined) {
						row['\'' + prop + '\''] = obj[prop];
					} else {
						row[prop] = obj[prop];
					}
				}

			} else {
				// Throw a warning if the developer is doing something stupid
				Ti.API.warn('Invalid arguement: Update only receives an object or an integer');
			}

			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));

			Ti.API.info('TiStorage - Updated Record');

			return this;
		};

		/**
		 * Removes one specified row / data in the selected collection
		 *
		 * @param (integer) itemId The item ID property of the record
		 */
		this.remove = function(itemId) {
			// @TODO Determine whether to remove by ID or by associative object
			// Make sure we're dealing with the right collection
			var collection = this.storage[this.database][this.collection];

			// Get the row to remove by ID reference
			var row = this.findOne({ id: itemId });

			// If there's nothing to remove return null
			if( row == null ){ return null; }

			// Splice out the array index of the row
			collection.splice(collection.indexOf(row), 1);

			// Save the collection minus the removed row above
			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));

			Ti.API.info('TiStorage - Removed record: ' + row.id);

			return this;
		};

	    /*
		 * Removes ALL records in a collection
		 *
		 * @author wibblz
		 */
	    this.clear = function(){
	        var objects = this.find();				// Assign all records in a collection
	        var objects_length = objects.length;	// Get the record count
	        var ids = [];							// Start the id array

			// Loop through each row and push the row ID in to the ID array
	        for(var i = 0; i < objects_length; i++) {
				ids.push( objects[i].id );
			}
			// Loop through ID / index and remove them
	        for(var k = 0; k < objects_length; k++) {
				this.remove(ids[k]);
			}
	    };

		/**
		 * Check to see if a record exists
		 *
		 * @author wibblz
		 * @param (object) obj The object to check
		 */
	    this.exists = function(obj) {
			var result;
			if( typeof(this.find(obj, 'true')) === 'object' ) {
				result = 1;
			} else {
				result = 0;
			}

			return result;
	    };

		/**
		 * Helper filter for find() to return a record set where only the following are true
		 *
		 * @author wibblz
		 * @param (object) obj The object to filter by
		 */
		this.findSpecific = function(obj, collection, qty){
			// Double check that the found rows have ALL the matching properties requested by obj
			var records = [];
			var nonRequiredProperties = ['keys', 'merge'];

			var requiredPropertiesCount = 0;
			for(var e in obj){ if( nonRequiredProperties.indexOf(e) == -1 ){ requiredPropertiesCount++; } }
			for(var i = 0; i < collection.length; i++)
			{
				var foundPropertiesCount = 0;
				for(var prop in obj)
				{
					if( obj.hasOwnProperty(prop) && collection[i][prop] === obj[prop] ){ foundPropertiesCount++;  }
				}
				if( foundPropertiesCount == requiredPropertiesCount ){
					if( records.indexOf(collection[i]) == -1 ){ records.push(collection[i]); }
				}
			}

			return records;
		};

		/**
		 * Wrapper method to narrow search to only one record
		 *
		 * @param (object) obj The object to filter by
		 */
		this.findOne = function(obj) {
			return this.find(obj, 'true');
		};

		/**
		 * Find a record by the criteria provided
		 *
		 * @param (object) obj The object criteria to filter by
		 * @param (bool) qty Whether to filter for one result or return all matching
		 */
		this.find = function(obj, qty) {
			var collection = this.storage[this.database][this.collection];

			if(obj === undefined) {
				return collection; // return the whole collection object
			} else {
				// Cache the record array
				var record = [];

				// Loop through all collection records (the big mess begins)
				for(var i = 0; i < collection.length; i++)
				{
					// Need to make sure we're looping for the obj's stuff
					for(var prop in obj)
					{
						// Just proper (keeps JSLint happy too)
						if(obj.hasOwnProperty(prop))
						{
							// Go through each property in the array index
							for(var row in collection[i])
							{
								if(collection[i].hasOwnProperty(row))
								{
									// If the collection's record matches the criteria obj, return it
									if(prop === row && obj[prop] === collection[i][row])
									{
										// If qty is not specified, get all matching records
										if(qty === undefined)
										{
											// @TODO - implement a way to return ANY, non-specific matching records
											record.push(collection[i]);
										} else {
											Ti.API.info('TiStorage - Record Selected: ' + collection[i].id);

											return collection[i];
											//this.findSpecific(obj, collection[i])
										}
									}
								}
							}
						}
					}
				}

				// Return of array of matching records
				if(qty === undefined) {
					Ti.API.info('TiStorage - Records Selected: ' + record);
					return this.findSpecific(obj, record);

					// @TODO - implement a way to return ANY, non-specific matching records
					// return record;
				}
			}

		}; // End of find();


	}; // End of TiStorage.Core

    return this;
} // End of TiStorage
