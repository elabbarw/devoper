'use strict';

var Datepicker = (function() {

	// Variables

	var $datepicker = $('.datepicker');


	// Methods

	function init($this) {
		var options = {
			disableTouchKeyboard: true,
			autoclose: false
		};

		$this.datepicker(options);
	}


	// Events

	if ($datepicker.length) {
		$datepicker.each(function() {
			init($(this));
		});
	}

})();

//
// Icon code copy/paste
//

'use strict';

var CopyIcon = (function() {

	// Variables

	var $element = '.btn-icon-clipboard',
		$btn = $($element);


	// Methods

	function init($this) {
		$this.tooltip().on('mouseleave', function() {
			// Explicitly hide tooltip, since after clicking it remains
			// focused (as it's a button), so tooltip would otherwise
			// remain visible until focus is moved away
			$this.tooltip('hide');
		});

		var clipboard = new ClipboardJS($element);

		clipboard.on('success', function(e) {
			$(e.trigger)
				.attr('title', 'Copied!')
				.tooltip('_fixTitle')
				.tooltip('show')
				.attr('title', 'Copy to clipboard')
				.tooltip('_fixTitle')

			e.clearSelection()
		});
	}


	// Events
	if ($btn.length) {
		init($btn);
	}

})();

//
// Form control
//

'use strict';

var FormControl = (function() {

	// Variables

	var $input = $('.form-control');


	// Methods

	function init($this) {
		$this.on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
	}


	// Events

	if ($input.length) {
		init($input);
	}

})();
//
 // Headroom - show/hide navbar on scroll
 //

 'use strict';

 var Headroom = (function() {

 	// Variables

 	var $headroom = $('#navbar-main');


 	// Methods

 	function init($this) {

     var headroom = new Headroom(document.querySelector("#navbar-main"), {
         offset: 300,
         tolerance: {
             up: 30,
             down: 30
         },
     });
	}


 	// Events

 	if ($headroom.length) {
 		headroom.init();
 	}
	 
 });

 //
// Navbar
//

'use strict';

var Navbar = (function() {

	// Variables

	var $nav = $('.navbar-nav, .navbar-nav .nav');
	var $collapse = $('.navbar .collapse');
	var $dropdown = $('.navbar .dropdown');

	// Methods

	function accordion($this) {
		$this.closest($nav).find($collapse).not($this).collapse('hide');
	}

    function closeDropdown($this) {
        var $dropdownMenu = $this.find('.dropdown-menu');

        $dropdownMenu.addClass('close');

    	setTimeout(function() {
    		$dropdownMenu.removeClass('close');
    	}, 200);
	}


	// Events

	$collapse.on({
		'show.bs.collapse': function() {
			accordion($(this));
		}
	})

	$dropdown.on({
		'hide.bs.dropdown': function() {
			closeDropdown($(this));
		}
	})

})();


//
// Navbar collapse
//


var NavbarCollapse = (function() {

	// Variables

	var $nav = $('.navbar-nav'),
		$collapse = $('.navbar .collapse');


	// Methods

	function hideNavbarCollapse($this) {
		$this.addClass('collapsing-out');
	}

	function hiddenNavbarCollapse($this) {
		$this.removeClass('collapsing-out');
	}


	// Events

	if ($collapse.length) {
		$collapse.on({
			'hide.bs.collapse': function() {
				hideNavbarCollapse($collapse);
			}
		})

		$collapse.on({
			'hidden.bs.collapse': function() {
				hiddenNavbarCollapse($collapse);
			}
		})
	}

})();

//
// Form control
//

'use strict';

var noUiSlider = (function() {


	if ($(".input-slider-container")[0]) {
			$('.input-slider-container').each(function() {

					var slider = $(this).find('.input-slider');
					var sliderId = slider.attr('id');
					var minValue = slider.data('range-value-min');
					var maxValue = slider.data('range-value-max');

					var sliderValue = $(this).find('.range-slider-value');
					var sliderValueId = sliderValue.attr('id');
					var startValue = sliderValue.data('range-value-low');

					var c = document.getElementById(sliderId),
							d = document.getElementById(sliderValueId);

					noUiSlider.create(c, {
							start: [parseInt(startValue)],
							connect: [true, false],
							//step: 1000,
							range: {
									'min': [parseInt(minValue)],
									'max': [parseInt(maxValue)]
							}
					});

					c.noUiSlider.on('update', function(a, b) {
							d.textContent = a[b];
					});
			})
	}

	if ($("#input-slider-range")[0]) {
			var c = document.getElementById("input-slider-range"),
					d = document.getElementById("input-slider-range-value-low"),
					e = document.getElementById("input-slider-range-value-high"),
					f = [d, e];

			noUiSlider.create(c, {
					start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
					connect: !0,
					range: {
							min: parseInt(c.getAttribute('data-range-value-min')),
							max: parseInt(c.getAttribute('data-range-value-max'))
					}
			}), c.noUiSlider.on("update", function(a, b) {
					f[b].textContent = a[b]
			})
	}

})();

//
// Scroll to (anchor links)
//

'use strict';

var ScrollTo = (function() {

	//
	// Variables
	//

	var $scrollTo = $('.scroll-me, [data-scroll-to], .toc-entry a');


	//
	// Methods
	//

	function scrollTo($this) {
		var $el = $this.attr('href');
        var offset = $this.data('scroll-to-offset') ? $this.data('scroll-to-offset') : 0;
		var options = {
			scrollTop: $($el).offset().top - offset
		};

        // Animate scroll to the selected section
        $('html, body').stop(true, true).animate(options, 600);

        event.preventDefault();
	}


	//
	// Events
	//

	if ($scrollTo.length) {
		$scrollTo.on('click', function(event) {
			scrollTo($(this));
		});
	}

})();

//
// Tooltip
//

'use strict';

var Tooltip = (function() {

	// Variables

	var $tooltip = $('[data-toggle="tooltip"]');


	// Methods

	function init() {
		$tooltip.tooltip();
	}


	// Events

	if ($tooltip.length) {
		init();
	}

})();


	// Parse global options
	function parseOptions(parent, options) {
		for (var item in options) {
			if (typeof options[item] !== 'object') {
				parent[item] = options[item];
			} else {
				parseOptions(parent[item], options[item]);
			}
		}
	}

	// Push options
	function pushOptions(parent, options) {
		for (var item in options) {
			if (Array.isArray(options[item])) {
				options[item].forEach(function(data) {
					parent[item].push(data);
				});
			} else {
				pushOptions(parent[item], options[item]);
			}
		}
	}

	// Pop options
	function popOptions(parent, options) {
		for (var item in options) {
			if (Array.isArray(options[item])) {
				options[item].forEach(function(data) {
					parent[item].pop();
				});
			} else {
				popOptions(parent[item], options[item]);
			}
		}
	}

	// Toggle options
	function toggleOptions(elem) {
		var options = elem.data('add');
		var $target = $(elem.data('target'));
		var $chart = $target.data('chart');

		if (elem.is(':checked')) {

			// Add options
			pushOptions($chart, options);

			// Update chart
			$chart.update();
		} else {

			// Remove options
			popOptions($chart, options);

			// Update chart
			$chart.update();
		}
	}

	// Update options
	function updateOptions(elem) {
		var options = elem.data('update');
		var $target = $(elem.data('target'));
		var $chart = $target.data('chart');

		// Parse options
		parseOptions($chart, options);

		// Toggle ticks
		toggleTicks(elem, $chart);

		// Update chart
		$chart.update();
	}

	// Toggle ticks
	function toggleTicks(elem, $chart) {

		if (elem.data('prefix') !== undefined || elem.data('prefix') !== undefined) {
			var prefix = elem.data('prefix') ? elem.data('prefix') : '';
			var suffix = elem.data('suffix') ? elem.data('suffix') : '';

			// Update ticks
			$chart.options.scales.yAxes[0].ticks.callback = function(value) {
				if (!(value % 10)) {
					return prefix + value + suffix;
				}
			}

			// Update tooltips
			$chart.options.tooltips.callbacks.label = function(item, data) {
				var label = data.datasets[item.datasetIndex].label || '';
				var yLabel = item.yLabel;
				var content = '';

				if (data.datasets.length > 1) {
					content += '<span class="popover-body-label mr-auto">' + label + '</span>';
				}

				content += '<span class="popover-body-value">' + prefix + yLabel + suffix + '</span>';
				return content;
			}

		}
	}


	// Events

	// Parse global options
	if (window.Chart) {
		parseOptions(Chart, chartOptions());
	}

	// Toggle options
	$toggle.on({
		'change': function() {
			var $this = $(this);

			if ($this.is('[data-add]')) {
				toggleOptions($this);
			}
		},
		'click': function() {
			var $this = $(this);

			if ($this.is('[data-update]')) {
				updateOptions($this);
			}
		}
	});


	// Return

	return {
		colors: colors,
		fonts: fonts,
		mode: mode
	};

// Pipeline Deployer
function pipelinedeploy(namefix){
	var pipesock = io.connect('/pipelinerunner');
	var rawform = $('#'+namefix+'-form');
	var form = getFormData(rawform);
	var pipe_status = $('#'+namefix+'-status');
	pipe_status.empty();
	var pipe_log = $('#'+namefix+'-log');
	pipe_log.empty();
	var pipe_icon = $('#'+namefix+'-icon');
	var sendtoflask = JSON.stringify(form);
   
	

	pipe_icon.html('<i class="text-black fas fa-sync fa-spin"></i>')
	pipesock.emit('queue_job', sendtoflask);
	pipesock.on('job_status', function(message)
	{
		
		pipe_status.html(message);
		switch(message){
			case '<b><p class="text-white bg-success">Pipeline Completed Successfully</p></b>': pipe_icon.html('<i class="text-black fa fa-check fa-2"></i>'); break;
			case '<b><p class="text-white bg-danger">Pipeline Complete with Failures</p></b>': pipe_icon.html('<i class="text-black fa fa-exclamation-circle fa-2"></i>'); break;
			default: pipe_icon.html('<i class="text-black fas fa-sync fa-spin fa-2"></i>'); break;
		}

	});
	pipesock.on('job_log', function(message){

		var newtable = '<center><b><table class="table table-sm table-condensed text-xsmall table-flush" width="100%"><thead><tr><th scope="col">Logs</th><th scope="col">Task Name</th><th scope="col">Task Status</th><th scope="col">Task Result</th></tr></thead><tbody>';
		message.forEach(function(item){
			if (item.Result == null) {item.result == 'No Info'}
			var cleanname = item.Name.replace(/[^a-z0-9+]+/gi, '') //remove non alphanumeric and whitespaces for div names
			switch (item.Result){
				case 'succeeded': newtable += '<tr><td><a class="badge badge-info" data-toggle="collapse" role="button" href="#col-'+cleanname+'" aria-expanded="false">></a></td><td>'+item.Name+'</td><td>'+item.Status+'</td><td class="text-white bg-success">'+item.Result+'</td></tr><tr id="col-'+cleanname+'" class="collapse"><td colspan="4"><pre style="word-wrap: break-word; white-space: pre-wrap;">'+item.Logs+'</pre></td></tr>'; break;
				case 'failed': newtable += '<tr><td><a class="badge badge-info" data-toggle="collapse" role="button" href="#col-'+cleanname+'" aria-expanded="false">></a></td><td>'+item.Name+'</td><td>'+item.Status+'</td><td class="text-white bg-danger">'+item.Result+'</td></tr><tr id="col-'+cleanname+'" class="collapse"><td colspan="4"><pre style="word-wrap: break-word; white-space: pre-wrap;">'+item.Logs+'</pre></td></tr>'; break;
				default: newtable += '<tr><td><a class="badge badge-info" data-toggle="collapse" role="button" href="#col-'+cleanname+'" aria-expanded="false">></a></td><td>'+item.Name+'</td><td>'+item.Status+'</td><td class="text-white bg-info">'+item.Result+'</td></tr><tr id="col-'+cleanname+'" class="collapse"><td colspan="4"><pre style="word-wrap: break-word; white-space: pre-wrap;">'+item.Logs+'</pre></td></tr>'; break;

			}

			
	});
	

	newtable += '</tbody><tfoot></tfoot></table></b></center>';


	pipe_log.html(newtable);


});

};


		function pipelinemenu() {

			var table = new Tabulator('#pipelinelist', {
				pagination:"local",
				paginationSize: 10,
				height: "100%",
				layout:"fitColumns",
				paginationSizeSelector: true,
				resizableColumns: true,
				responsiveLayout:"collapse",
				paginationSizeSelector:[10, 25, 50, 100, 500, 1000],
				responsiveLayoutCollapseStartOpen:false,
				addRowPos:"bottom",
				cellHozAlign:"center", 
				selectable: false,
				movableColumns:true, 
				ajaxResponse:function(url, params, response){

					return response; 
				},
				rowContextMenu:[
					{
						label:"Start a Build Queue",
						action:function(e, row){
							var row = row.getData();
							var namefix = row.name.replace(/\s+/g, '-').toLowerCase();
							$('#'+namefix+'modal').modal('show')
			
							
							
						}
					}
				],
				
				columns:[                 //define the table columns
					{title:"Pipeline Name", field:"name"},
					{title:"Pipeline ID", field:"id"},
					{title:"Updated By", field:"author"},
					{title:"Current Status", field:"info.status",formatter: function(cell, formatterParams, onRendered){
						let data = cell.getValue();
												
						if (data == 'completed') {
							return ("<span class='badge badge-dot mr-4'><i class='bg-success'></i><span class='status'>" + data + "</span>");
						}
						 else {
							return ("<span class='badge badge-dot mr-4'><i class='bg-info'></i><span class='status'>" + data + "</span>");
						}
					}},
					{title:"Last Result", field:"info.result", formatter: function(cell, formatterParams, onRendered){
						let data = cell.getValue();
												
						if (data == 'succeeded') {
							return ("<span class='badge badge-dot mr-4'><i class='bg-success'></i><span class='status'>" + data + "</span>");
						}else if (data == 'failed') {
							return ("<span class='badge badge-dot mr-4'><i class='bg-danger'></i><span class='status'>" + data + "</span>");
						}
						 else {
							return ("<span class='badge badge-dot mr-4'><i class='bg-info'></i><span class='status'>" + data + "</span>");
						}
					}},
					{title:"Last Queue Time", field:"info.queuetime"},
					{title: "", field: "", print:false, download:false, formatter: function(cell, formatterParams, onRendered){
				
						var row = cell.getData()
						var namefix = row.name.replace(/\s+/g, '-').toLowerCase();
		
						var modal = '<div class="modal fade" id="'+namefix+'modal" tabindex="-1" role="dialog" aria-labelledby="'+namefix+'modalLabel" aria-hidden="true">'
						modal += '<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">'
						modal += '<div class="modal-content">'
						modal += '<div class="modal-header">'
						modal += '<h5 class="modal-title" id="'+namefix+'modalLabel">Pipeline Runner: '+row.name+'</h5>'
						modal += '&nbsp;&nbsp;&nbsp;<div id="'+namefix+'-icon"></div>'
						modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						modal += '<span aria-hidden="true">X</span>'
						modal += '</button>'
						modal += '</div>'
						modal += '<div class="modal-body">'
						modal += '<center>'
					if (row.info.variables){
						modal += '<form id="'+namefix+'-form"  onsubmit="event.preventDefault(); pipelinedeploy(\''+namefix+'\');"><table>'
						row.info.variables.forEach(function(variable)
						{
						modal += '<tr>'
						modal += '<td>'
						modal += '<label for="'+row.id+'-'+variable.name+'">'+variable.name+'</label>'
						modal += '</td>'
						modal += '<td></td>'
						modal += '<td>'
						
						if ((variable.options.value).includes('validation')){
							try{
								var validation = JSON.parse(variable.options.value).validation
								modal += '<input id="'+row.id+'-'+row.org+'-'+row.prj+'-'+variable.name+'" type="text" pattern="'+validation.regex+'" minlength="'+validation.min+'" maxlength="'+validation.max+'" value="'+validation.value+'"> <br />'}
								catch{modal += '<input id="'+row.id+'-'+row.org+'-'+row.prj+'-'+variable.name+'" type="text" value="ERROR - PLEASE CHECK VARIABLE REGEX PATTERN"> <br />'}
							}
						else{
						modal += '<input id="'+row.id+'-'+row.org+'-'+row.prj+'-'+variable.name+'" type="text" value="'+variable.options.value+'"> <br />'
					}
						modal += '</td>'
						modal += '</tr>'

					}) 
						modal += '<tr><td><center>'
						modal += '<button class="btn btn-primary">Queue the Pipeline</button>'
						modal += '</center></td></tr>'
						modal += '</form></table>'
						}
						modal += '<br><div id="'+namefix+'-status" class="text-center"><div>'
						modal += '</center>'
						modal += '</div>'
						modal += '<div class="modal-footer">'
						modal += '<a href="#" class="btn btn-link  ml-auto" data-dismiss="modal">Close</a>'
						modal += '</div>'
						modal += '</div>'
						modal += '</div>'
						modal += '</div>'
						modal += '</div>'
						$('#modals').append(modal);
					}},
				],
			});
		
							
			function getpipelines(org,prj){
			// Clear the table
			table.clearData();
			// Clear the forms
			$('#modals').empty();
			// Trigger AJAX for subnet list
			table.setData("/pipelinerunner?org="+org+"&prj="+prj)
			
			
			

		}

		$('#getpipelines').click(function(event){
			var values = $('#project').find(":selected").text().split("->");
			var org = values[0]
			var prj = values[1]
			event.preventDefault();
			if (org&&prj){
			getpipelines(org,prj)}
			else{alert('You have not chosen a project! If you do not have any project options please get in touch with the project owner')}

		});

						
					}


					function adminmenu() {

						var table = new Tabulator('#admintable', {
							pagination:"local",
							paginationSize: 10,
							height: "100%",
							layout:"fitColumns",
							paginationSizeSelector: true,
							ajaxURL:"/adminfetch",
							history:true, 
							resizableColumns: true,
							responsiveLayout:"collapse",
							paginationSizeSelector:[10, 25, 50, 100, 500, 1000],
							responsiveLayoutCollapseStartOpen:false,
							addRowPos:"bottom",
							cellHozAlign:"center", //center align cell contents
							selectable: true,
							movableColumns:true,      //allow column order to be changed
				
							columns:[                 //define the table columns
								{title:"Organization", field:"org", editor:"input"},
								{title:"Project", field:"prj", editor:"input"},
								{title:"AD Group", field:"ad_group", editor:"input"}
							],
						});	
						
							//Add row on "Add Row" button click
							$("#add-row").click(function(){
								table.addRow({});
							});

							//Delete row on "Delete Row" button click
							$("#del-row").click(function(){
								var selectedRows = table.getSelectedRows();
								selectedRows.forEach(function(row){
									table.deleteRow(row)
								})
							});

							//Clear table on "Empty the table" button click
							$("#clear").click(function(){
								table.clearData()
							});

							//Reset table contents on "Reset the table" button click
							$("#reset").click(function(){
								table.setData();
							});

							//Save the config
							$("#saveconfig").click(function(){
								var array = JSON.stringify(table.getData());

								console.log(array)

								$.ajax({
									type: "POST",
									url: '/adminfetch',
									data: array,
									contentType: 'application/json',
									success: function(data)
									{
										$('#configstatus').html('<div class="bg-success"><h4 class="text-white">Configuration Saved!</h4></div>')
									},
									fail: function()
									{
										$('#configstatus').html('<div class="bg-danger"><h4 class="text-white">Configuration Save Failure!</h4></div>')
									}
								  });
								
							});
								}
			
								




		