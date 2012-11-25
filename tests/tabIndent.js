var tabEvent = document.createEvent('KeyboardEvent');
// Chromium Hack
Object.defineProperty(tabEvent, 'keyCode', {
    get : function() {
        return this.keyCodeVal;
    }
});     
Object.defineProperty(tabEvent, 'which', {
    get : function() {
        return this.keyCodeVal;
    }
});
tabEvent.initKeyboardEvent('keydown', true, true, null, false, false, false, false, 9, 9);
tabEvent.keyCodeVal = 9;

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

	describe("tab functionality", function() {
		it('should insert a tab at the current cursor (no selection) and replace the cursor at the expected position', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = 'abc';
			el.selectionStart = 1;
			el.selectionEnd = 1;
			el.dispatchEvent(tabEvent);
			expect(el.value).toEqual("a\tbc");
			expect(el.selectionStart).toEqual(2);
			expect(el.selectionEnd).toEqual(2);
		});

		it('should insert a tab at the current cursor start (when a single line of text is highlighted) and maintain highlighted text', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = 'abc';
			el.selectionStart = 1;
			el.selectionEnd = 3;
			el.dispatchEvent(tabEvent);
			expect(el.value).toEqual("a\tbc");
			expect(el.selectionStart).toEqual(2);
			expect(el.selectionEnd).toEqual(4);
		});

		it('should indent the entire block if the selection is multi-line', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = "ab\ncd";
			el.selectionStart = 0;
			el.selectionEnd = 5;
			el.dispatchEvent(tabEvent);
			expect(el.value).toEqual("\tab\n\tcd");
			expect(el.selectionStart).toEqual(0);
			expect(el.selectionEnd).toEqual(7);
		});
	});
});