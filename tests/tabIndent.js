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
if (tabEvent.initKeyboardEvent) tabEvent.initKeyboardEvent('keydown', true, true, null, false, false, false, false, 9, 9);
else tabEvent.initKeyEvent('keydown', true, true, null, false, false, false, false, 9, 9);
tabEvent.keyCodeVal = 9;

var shiftTabEvent = document.createEvent('KeyboardEvent');
// Chromium Hack
Object.defineProperty(shiftTabEvent, 'keyCode', {
    get : function() {
        return this.keyCodeVal;
    }
});
Object.defineProperty(shiftTabEvent, 'which', {
    get : function() {
        return this.keyCodeVal;
    }
});
if (shiftTabEvent.initKeyboardEvent) shiftTabEvent.initKeyboardEvent('keydown', true, true, null, false, false, true, false, 9, 9);
else shiftTabEvent.initKeyEvent('keydown', true, true, null, false, false, true, false, 9, 9);
shiftTabEvent.keyCodeVal = 9;

describe("tabIndent", function() {
	beforeEach(function() {
    tabIndent.config.tab = '\t';
		document.getElementById('env').innerHTML =
			'<textarea class="tabIndent"></textarea><textarea id="foobar"></textarea><div id="lorem"></div>';
	});

	describe("isMultiLine()", function() {
		it('should be able to detect when a selection is multiline', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = 'ab\ncd';
			el.selectionStart = 1;
			el.selectionEnd = 4;
			expect(tabIndent.isMultiLine(el)).toBe(true);
		});
		it('should be able to detect when a selection is NOT multiline', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = 'abcd';
			el.selectionStart = 1;
			el.selectionEnd = 4;
			expect(tabIndent.isMultiLine(el)).toBe(false);
		});
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

    it('should indent multi-line selection using non-default tab sequence', function() {
			tabIndent.config.tab = 'abcd';
			var tabWidth = 4;
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = "ab\ncd";
			el.selectionStart = 0;
			el.selectionEnd = 5;
			el.dispatchEvent(tabEvent);
			expect(el.value).toEqual("\tab\n\tcd");
			expect(el.selectionStart).toEqual(0);
			expect(el.selectionEnd).toEqual(5 + 2*tabWidth);
		});
	});

	describe("shift-tab functionality", function() {
		it('should remove a tab character if it is in front of one (no highlight)', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = "ab\tcd";
			el.selectionStart = 3;
			el.selectionEnd = 3;
			el.dispatchEvent(shiftTabEvent);
			expect(el.value).toEqual("abcd");
			expect(el.selectionStart).toEqual(2);
			expect(el.selectionEnd).toEqual(2);
		});

		it('should remove a tab character if it is in front of one (with single-line highlighted text)', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = "ab\tcd";
			el.selectionStart = 3;
			el.selectionEnd = 5;
			el.dispatchEvent(shiftTabEvent);
			expect(el.value).toEqual("abcd");
			expect(el.selectionStart).toEqual(2);
			expect(el.selectionEnd).toEqual(4);
		});

		it('should remove a tab character at the beginning of each line, if selection is multiline', function() {
			var el = document.getElementById('foobar');
			tabIndent.render(el);
			el.value = "\tab\n\tcd";
			el.selectionStart = 2;
			el.selectionEnd = 6;
			el.dispatchEvent(shiftTabEvent);
			expect(el.value).toEqual("ab\ncd");
			expect(el.selectionStart).toEqual(0);
			expect(el.selectionEnd).toEqual(5);
		});
	});
});
