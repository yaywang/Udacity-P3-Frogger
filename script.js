$('.folio').on({
	mouseenter: function() {
		$(this).children('.folio-img').addClass('dim');
		$(this).children('.folio-description').addClass('active');
	},
	mouseleave: function() {
		$(this).children('.folio-img').removeClass('dim');
		$(this).children('.folio-description').removeClass('active');
	}
});