jQuery.entwine("dependentdropdown", function ($) {

	$(":input.dependent-dropdown").entwine({
		onmatch: function () {
			var drop = this;
			var depentName = drop.data('depends').replace(/[#;&,.+*~':"!^$[\]()=>|\/]/g, "\\$&");
			var depends = ($(":input[name=" + depentName + "]"));

			this.parents('.field:first').addClass('dropdown');

			// watch change of the dependent field and load new data
			// since watching on the dependent field seems not working with TreeDropdownField, we watch the whole form changes and determine change for the dependent field
			this.closest('form').on('change', function(e) {
				if (e.target.name === depentName) {
					if (!e.target.value) {
						drop.disable(drop.data('unselected'));
					} else {
						drop.disable("Loading...");
	
						$.get(drop.data('link'), {
							val: e.target.value
						},
						function (data) {
							drop.enable();
	
							if (drop.data('empty') || drop.data('empty') === "") {
								drop.append($("<option />").val("").text(drop.data('empty')));
							}
	
							$.each(data, function () {
								drop.append($("<option />").val(this.k).text(this.v));
							});
							drop.trigger("liszt:updated").trigger("chosen:updated").trigger("change");
						});
					}
				}
			});

			if (!depends.val()) {
				drop.disable(drop.data('unselected'));
			}
		},
		disable: function (text) {
			this.empty().append($("<option />").val("").text(text)).attr("disabled", "disabled").trigger("liszt:updated").trigger("chosen:updated");
		},
		enable: function () {
			this.empty().removeAttr("disabled").next().removeClass('chzn-disabled');
		}
	});

});
