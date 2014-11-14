(function (factory) {
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery','mustache'], factory);
} else {
    // No AMD. Register plugin with global jQuery object.
    factory(jQuery);
}
}(function ($,mustache) {

    $.fn.animalselect = function (options) {

    	var template='\
    	<div class="extra-form">\
			<input data-attrleft="KYN_NUMER" type="text" placeholder="Kyn" class="filter_left"></input>\
			<input data-attrleft="STADA_NUMER" type="text" placeholder="Staða"class="filter_left" ></input>\
		</div>\
		<div class="double_container">\
			<div style="display: inline-flex;">\
				<!-- Select left -->\
				<div>\
					<input id="animals_filter_1" type="text" placeholder="Gripir" class="filter_input filter_left" data-attrleft="VALNR">\
					<select id="animals_select_1" multiple></select>\
					<div id="numbers_left" class="numbers"></div>\
				</div>\
				<!-- buttons -->\
				<div class="select_buttons_div">\
				  <div id="select_buttons_div">\
				    <input id="move_right" type="button" value="&gt;&gt;" /><br>\
				    <input id="move_left" type="button" value="&lt;&lt;" />\
				  </div>\
				 </div>\
				<!-- Select right -->\
				<div >\
					<input id="animals_filter_2" type="text" placeholder="Valdar gripir" class="filter_input">\
					<select id="animals_select_2" multiple ></select>\
					<div id="numbers_right"  class="numbers"></div>\
				</div>\
			</div>\
		</div>'

		var option_tpl='{{#animals}}<option value="{{NUMER}}">{{VALNR}}</option>{{/animals}}'

		var filter_type = 'VALNR'

		if(options._template){
			template=options._template
		}

		if(options._option_tpl){
			option_tpl=options._option_tpl
		}

		if(options._filter_type){
			filter_type=options._filter_type
		}

    	$(this).html(template)
		var leftList=new Array();
		var filteredLeft=new Array();
		var rightList=new Array();
		var filteredRight=new Array();

		set_listeners()

		if(!options._service){

			fill_list($("#animals_select_1"),options._data)
			leftList=options._data
			$("#numbers_left").html("("+leftList.length+")")

		}else{

			$.getJSON(options._service,{farm_id:options._farm_id}).done(function(data){ 
				fill_list($("#animals_select_1"),data.herdlist)
				leftList=data.herdlist
				$("#numbers_left").html("("+leftList.length+")")
				$("#animals_select_1").trigger('loaded',data);
			})

		}


		function fill_list(_select,_animals){
			var html_animals = mustache.render(option_tpl,{animals:_animals});
			_select.html(html_animals);
		}
		

		function set_listeners(){

			filter1=$("#animals_filter_1")
			filter2=$("#animals_filter_2")
			select1=$("#animals_select_1")
			select2=$("#animals_select_2")
			right=$("#move_right")
			left=$("#move_left")

			// automatic dash for valnr
			filter1.on("change keyup",function(){
				if(event.keyCode != 8 && filter_type=="VALNR" && /^\d{2}$/.test(filter1.val())){
					filter1.val(filter1.val()+'-')
				}

				if(event.keyCode == 13){
					$('#animals_select_1 option').prop('selected', 'selected');
					var selectedItems = select1.find('option:selected')
					select2.prepend(selectedItems);
					select2.sort_select_box()
					_.each(selectedItems,function(item,index){
						rightList.push(find_animal(leftList,$(item).val()))
						leftList=remove_from_list(leftList,$(item).val())
					})
					filter1.select()
				}
			});

			filter2.on("change keyup",function(){
				if(event.keyCode != 8 && filter_type=="VALNR" && /^\d{2}$/.test(filter2.val())){
					filter2.val(filter2.val()+'-')
				}

				if(event.keyCode == 13){
					$('#animals_select_2 option').prop('selected', 'selected');
					var selectedItems = select2.find('option:selected')
					select1.prepend(selectedItems);
					select1.sort_select_box()
					_.each(selectedItems,function(item,index){
						leftList.push(find_animal(rightList,$(item).val()))
						rightList=remove_from_list(rightList,$(item).val())
					})
					filter2.select()
				}
			});

			// left/right button listeners
			left.on("click",function() {

				var selectedItems = select2.find('option:selected')
				select1.prepend(selectedItems);
				select1.sort_select_box()
				_.each(selectedItems,function(item,index){
					leftList.push(find_animal(rightList,$(item).val()))
					rightList=remove_from_list(rightList,$(item).val())
				})

				$("#numbers_left").html("("+select1[0].length+")")

				if(rightList.length==0){
					$("#numbers_right").html("")
				}else{
					$("#numbers_right").html("("+rightList.length+")")
				}

			});

			right.on("click",function() {

				var selectedItems = select1.find('option:selected')
				select2.prepend(selectedItems);
				select2.sort_select_box()
				_.each(selectedItems,function(item,index){
					rightList.push(find_animal(leftList,$(item).val()))
					leftList=remove_from_list(leftList,$(item).val())
				})

				$("#numbers_right").html("("+rightList.length+")")

				if(select1[0].length==0){
					$("#numbers_left").html("")
				}else{
					$("#numbers_left").html("("+select1[0].length+")")
				}

			});

			// doubleclick listeners
			select1.on('dblclick',function() {
				var selectedItem = select1.find('option:selected')
				select2.prepend(selectedItem);
				select2.sort_select_box()
				select2.trigger("change");
				rightList.push(find_animal(leftList,$(selectedItem).val()))
				leftList=remove_from_list(leftList,$(selectedItem).val())

				$("#numbers_right").html("("+rightList.length+")")

				if(select1[0].length==0){
					$("#numbers_left").html("")
				}else{
					$("#numbers_left").html("("+select1[0].length+")")
				}

			})

			select2.on('dblclick',function() {
				var selectedItem = select2.find('option:selected')
				select1.prepend(selectedItem);
				select1.sort_select_box()
				select1.trigger("change");
				leftList.push(find_animal(rightList,$(selectedItem).val()))
				rightList=remove_from_list(rightList,$(selectedItem).val())

				$("#numbers_left").html("("+select1[0].length+")")

				if(rightList.length==0){
					$("#numbers_right").html("")
				}else{
					$("#numbers_right").html("("+rightList.length+")")
				}

			})
		}

		function filter_right(_list,value){

			if(value.length>0){
				return _.filter(_list, function(animal){
					if(animal[filter_type].indexOf(value) > -1){ return true }
				})
			}else{
				return _list
			}
		}

		function filter_left(_list){	// todo: implement a more dynamic way to deal with filters
			var keys_values=get_keys_filter()

			if(keys_values.length == 1){

				return _.filter(_list, function(animal){
					if(animal[keys_values[0].key] && animal[keys_values[0].key].indexOf(keys_values[0].val) > -1 || keys_values[0].val==''){
						return true
					}
				})

			}else if(keys_values.length == 2){

				return _.filter(_list, function(animal){
					if( 
						(keys_values[0].val==animal[keys_values[0].key] || keys_values[0].val=='') &&
						(animal[keys_values[1].key] && animal[keys_values[1].key].indexOf(keys_values[1].val) > -1 || keys_values[1].val=='')
					){
						return true
					}
				})

			}else if(keys_values.length == 3){

				return _.filter(_list, function(animal){
					if( 
						(keys_values[0].val==animal[keys_values[0].key] || keys_values[0].val=='') &&
						(keys_values[1].val==animal[keys_values[1].key] || keys_values[1].val=='') &&
						(animal[keys_values[2].key] && animal[keys_values[2].key].indexOf(keys_values[2].val) > -1 || keys_values[2].val=='')
					){
						return true
					}
				})

			}

			// return _.filter(_list, function(animal){		// old implementation before 27-08-14

			// 	if( 
			// 		(keys_values[0].val==animal[keys_values[0].key] || keys_values[0].val=='') &&
			// 		(keys_values[1].val==animal[keys_values[1].key] || keys_values[1].val=='') &&
			// 		(animal[keys_values[2].key].indexOf(keys_values[2].val) > -1 || keys_values[2].val=='')
			// 	){
			// 		return true
			// 	}

			// })

		}

		function get_keys_filter(){

			var values=new Array()

			_.each($('select[data-attrleft]'),function(input){
				values.push({key:$(input).data('attrleft'),val:$(input).val()})
			})

			_.each($('input[data-attrleft]'),function(input){
				values.push({key:$(input).data('attrleft'),val:$(input).val()})
			})

			// temporary solution to make sure valnr is always last, to be fixed along with filter_left()
			if(values[values.length - 1]['key'] != filter_type){
				var key_valnr
				_.each(values,function(val,index){
					if(val['key'] == filter_type){
						key_valnr = val
						values.splice( index, 1 )
						values.push(key_valnr)
					}
				})
			}

			return values
		}

		function find_animal(_list,_numer){

			return _.find(_list, function(animal){
				if(_numer==animal['NUMER']){
					return true
				}
			})
		}

		function remove_from_list(_list,_numer){

			return _.reject(_list,function(animal){
				if(_numer==animal['NUMER']){
					return true
				}
			})
		}

		$("body").on("keyup change",".filter_left",function(event){
			$("#animals_select_1").html('');
			var filteredLeft=filter_left(leftList)
			fill_list($("#animals_select_1"),filteredLeft)
			$("#numbers_left").html("("+filteredLeft.length+")")
		})

		$("body").on("keyup change","#animals_filter_2",function(event){
			$("#animals_select_2").html('');
			var filteredRight=filter_right(rightList,$("#animals_filter_2").val())
			fill_list($("#animals_select_2"),filteredRight)
			$("#numbers_right").html("("+filteredRight.length+")")
		})

 		this.get_selected=function(){
 			return rightList
 		}

 		return this

    };


	$.fn.sort_select_box = function(){
		// Get options from select box
		var my_options = $("#" + this.attr('id') + ' option');
		// sort alphabetically
		my_options.sort(function(a,b) {
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else return 0
		})
		//replace with sorted my_options;
		$(this).empty().append( my_options );

		// clearing any selections
		$("#"+this.attr('id')+" option").attr('selected', false);
	}


}));
