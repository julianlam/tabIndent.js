tabIndent = {
	version: '0.1.7',
	config: {
		tab: '\t',
		images: '../images/'
	},
	events: {
		keydown: function(e) {
			var tab = tabIndent.config.tab;
			var tabWidth = tab.length;
			if (e.keyCode === 9) {
				e.preventDefault();
				var	currentStart = this.selectionStart,
					currentEnd = this.selectionEnd;
				if (e.shiftKey === false) {
					// Normal Tab Behaviour
					if (!tabIndent.isMultiLine(this)) {
						// Add tab before selection, maintain highlighted text selection
						this.value = this.value.slice(0, currentStart) + tab + this.value.slice(currentStart);
						this.selectionStart = currentStart + tabWidth;
						this.selectionEnd = currentEnd + tabWidth;
					} else {
						// Iterating through the startIndices, if the index falls within selectionStart and selectionEnd, indent it there.
						var	startIndices = tabIndent.findStartIndices(this),
							l = startIndices.length,
							newStart = undefined,
							newEnd = undefined,
							affectedRows = 0;

						while(l--) {
							var lowerBound = startIndices[l];
							if (startIndices[l+1] && currentStart != startIndices[l+1]) lowerBound = startIndices[l+1];

							if (lowerBound >= currentStart && startIndices[l] < currentEnd) {
								this.value = this.value.slice(0, startIndices[l]) + tab + this.value.slice(startIndices[l]);

								newStart = startIndices[l];
								if (!newEnd) newEnd = (startIndices[l+1] ? startIndices[l+1] - 1 : 'end');
								affectedRows++;
							}
						}

						this.selectionStart = newStart;
						this.selectionEnd = (newEnd !== 'end' ? newEnd + (tabWidth * affectedRows) : this.value.length);
					}
				} else {
					// Shift-Tab Behaviour
					if (!tabIndent.isMultiLine(this)) {
						if (this.value.substr(currentStart - tabWidth, tabWidth) == tab) {
							// If there's a tab before the selectionStart, remove it
							this.value = this.value.substr(0, currentStart - tabWidth) + this.value.substr(currentStart);
							this.selectionStart = currentStart - tabWidth;
							this.selectionEnd = currentEnd - tabWidth;
						} else if (this.value.substr(currentStart - 1, 1) == "\n" && this.value.substr(currentStart, tabWidth) == tab) {
							// However, if the selection is at the start of the line, and the first character is a tab, remove it
							this.value = this.value.substring(0, currentStart) + this.value.substr(currentStart + tabWidth);
							this.selectionStart = currentStart;
							this.selectionEnd = currentEnd - tabWidth;
						}
					} else {
						// Iterating through the startIndices, if the index falls within selectionStart and selectionEnd, remove an indent from that row
						var	startIndices = tabIndent.findStartIndices(this),
							l = startIndices.length,
							newStart = undefined,
							newEnd = undefined,
							affectedRows = 0;

						while(l--) {
							var lowerBound = startIndices[l];
							if (startIndices[l+1] && currentStart != startIndices[l+1]) lowerBound = startIndices[l+1];

							if (lowerBound >= currentStart && startIndices[l] < currentEnd) {
								if (this.value.substr(startIndices[l], tabWidth) == tab) {
									// Remove a tab
									this.value = this.value.slice(0, startIndices[l]) + this.value.slice(startIndices[l] + tabWidth);
									affectedRows++;
								} else {}	// Do nothing

								newStart = startIndices[l];
								if (!newEnd) newEnd = (startIndices[l+1] ? startIndices[l+1] - 1 : 'end');
							}
						}

						this.selectionStart = newStart;
						this.selectionEnd = (newEnd !== 'end' ? newEnd - (affectedRows * tabWidth) : this.value.length);
					}
				}
			} else if (e.keyCode == 27) {
				tabIndent.events.disable(e);
			}
		},
		disable: function(e) {
			console.log('disabling');
			var events = this;

			// Temporarily suspend the main tabIndent event
			tabIndent.remove(e.target);
		}
	},
	render: function(el) {
		var self = this;

		if (el.nodeName === 'TEXTAREA') {
			el.addEventListener('focus', function f() {
				console.log('focusing');
				var delayedRefocus = setTimeout(function() {
					var classes = (el.getAttribute('class') || '').split(' '),
					contains = classes.indexOf('tabIndent');

					el.addEventListener('keydown', self.events.keydown);
					el.style.backgroundImage = "url('" + self.config.images + "active.png')";
					el.style.backgroundPosition = 'top right';
					el.style.backgroundRepeat = 'no-repeat';

					if (contains !== -1) classes.splice(contains, 1);
					classes.push('tabIndent-rendered');
					el.setAttribute('class', classes.join(' '));

					el.removeEventListener('focus', f);
				}, 500);

				// If they were just tabbing through the input, let them continue unimpeded
				el.addEventListener('blur', function b() {
					clearTimeout(delayedRefocus);
					el.removeEventListener('blur', b);
				});
			});

			el.addEventListener('blur', function b(e) {
				self.events.disable(e);
			});
		}
	},
	renderAll: function() {
		// Find all elements with the tabIndent class
		var textareas = document.getElementsByTagName('textarea'),
			t = textareas.length,
			contains = -1,
			classes = [],
			el = undefined;

		while(t--) {
			classes = (textareas[t].getAttribute('class') || '').split(' ');
			contains = classes.indexOf('tabIndent');

			if (contains !== -1) {
				el = textareas[t];
				this.render(el);
			}
			contains = -1;
			classes = [];
			el = undefined;
		}
	},
	remove: function(el) {
		if (el.nodeName === 'TEXTAREA') {
			var classes = (el.getAttribute('class') || '').split(' '),
				contains = classes.indexOf('tabIndent-rendered');

			el.removeEventListener('keydown', this.events.keydown);
			el.style.backgroundImage = '';

			if (contains !== -1) classes.splice(contains, 1);
			classes.push('tabIndent');
			el.setAttribute('class', (classes.length > 1 ? classes.join(' ') : classes[0]));
		}
	},
	removeAll: function() {
		// Find all elements with the tabIndent class
		var textareas = document.getElementsByTagName('textarea'),
			t = textareas.length,
			contains = -1,
			classes = [],
			el = undefined;

		while(t--) {
			classes = (textareas[t].getAttribute('class') || '').split(' ');
			contains = classes.indexOf('tabIndent-rendered');

			if (contains !== -1) {
				el = textareas[t];
				this.remove(el);
			}
			contains = -1;
			classes = [];
			el = undefined;
		}
	},
	isMultiLine: function(el) {
		// Extract the selection
		var	snippet = el.value.slice(el.selectionStart, el.selectionEnd),
			nlRegex = new RegExp(/\n/);

		if (nlRegex.test(snippet)) return true;
		else return false;
	},
	findStartIndices: function(el) {
		var	text = el.value,
			startIndices = [],
			offset = 0;

		while(text.match(/\n/) && text.match(/\n/).length > 0) {
			offset = (startIndices.length > 0 ? startIndices[startIndices.length - 1] : 0);
			var lineEnd = text.search("\n");
			startIndices.push(lineEnd + offset + 1);
			text = text.substring(lineEnd + 1);
		}
		startIndices.unshift(0);

		return startIndices;
	}
}
