describe("tabIndent", function() {
	// var player;
	// var song;

	beforeEach(function() {
		document.getElementById('env').innerHTML =
			'<textarea class="tabIndent"></textarea><textarea id="foobar"></textarea><div id="lorem"></div>';
	});

	describe("render", function() {
		it("should be able to render a single textarea", function() {
			tabIndent.render(document.getElementById('foobar'));
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(1);
		});

		it("should do nothing if a non-textarea was attempted to be rendered", function() {
			tabIndent.render(document.getElementById('lorem'));
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(0);
		});

		it("should only render a textarea once", function() {
			tabIndent.render(document.getElementById('foobar'));
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(1);
		})
	});

	describe("renderAll", function() {
		it("should find all textareas with the tabIndent class, and render them", function() {
			tabIndent.renderAll();
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(1);
		});
	});

	describe("remove", function() {
		it("should be able to remove a single instance of an enabled textarea", function() {
			tabIndent.render(document.getElementById('foobar'));
			tabIndent.remove(document.getElementById('foobar'));
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(0);
		});

		it("should do nothing if it was called against a non-textarea", function() {
			tabIndent.remove(document.getElementById('lorem'));
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(0);
		});
	});

	describe("removeAll", function() {
		it("should be able to remove all instances", function() {
			tabIndent.renderAll();
			tabIndent.removeAll();
			expect(document.getElementsByClassName('tabIndent-rendered').length).toEqual(0);
		})
	});
});