animalselect
============

## Introduction

![alt tag](https://raw.githubusercontent.com/gillestasse/animalselect/master/documentation/double1.png)

**animalselect** is a jquery plugin, AMD ready that allow to select animal using two multiselect inputs.

## Features

- user can double click on the multi-select to move an element of the list to the other list
- user can use the middle buttons to move multiple records between lists
- user can filter each list
- jquery plugin
- AMD ready
- install with bower

## Dependencies.

The plugin needs :

- underscore (version ?)
- jquery (version ?)
- mustache (version ?)

## Use

### Includes in the head of the html :
```
	  <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="http://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js"></script>
		<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
		<script type="text/javascript" src="/static/js/bower_components/animalselect/dist/animalselect.js"></script>
		<link rel="stylesheet" type="text/css" href="/static/js/bower_components/animalselect/dist/animalselect.css">
```

### The plugin only needs a div :

```
<div class="test"></div>
```

### The javscript :

```
			$(document).ready(function set(){
				//var myselect=$(".test").animalselect({_service:'grid/getLocalHerd'})
				var myselect=$(".test").animalselect({
					_data:[{"KYN_NUMER":2,"NUMER":383689,"STADA_NUMER":1,"VALNR":"84-171"},{"KYN_NUMER":2,"NUMER":383681,"STADA_NUM            ER":1,"VALNR":"84-172"}]
				})

				$(myselect).on('loaded',function(){console.info('lode')})
			})
			
```

### Options :

_data : object to be displayed in the list

_service : a service that returns a json object of structure data.herdlist where herlist is the list of animals


### Methods :

 get_selected : returns the list of selected object of the list
 
